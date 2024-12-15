/**
 * otp controller
 */

import {factories} from '@strapi/strapi'
import axios from "axios";
import Kavenegar from 'kavenegar';

export default factories.createCoreController('api::otp.otp', ({strapi}) => (
    {
        async sendOTP(ctx) {
            const {phoneNumber} = ctx.request.body


            // Generate a random OTP
            const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
            const expireAt = new Date(Date.now() + 5 * 60 * 1000).toString(); // Expires in 5 minutes

            // Save OTP in the database
            await strapi.entityService.create('api::otp.otp', {
                data: {phoneNumber, otpCode, expireAt},
            });

            // Initialize Kavenegar API
            const api = Kavenegar.KavenegarApi({
                apikey: '6237422B34614C65344F63705A32465245735A6E4D6844704430344E54774C7944702F4771674C4F3333383D', // Replace with your actual API key
            });

            // Send OTP via SMS (using an example SMS API like Kavenegar)
            try {
                await new Promise((resolve, reject) => {
                    api.Send(
                        {
                            message: `Your OTP is: ${otpCode}`,
                            sender: "2000660110", // Replace with your sender ID
                            receptor: phoneNumber,
                        },
                        (response, status) => {
                            console.log(response, status)
                            if (status === 200) {
                                resolve(response);
                            } else {
                                reject(new Error(`Failed to send OTP: ${status}`));
                            }
                        }
                    );
                });

                return ctx.send({message: 'OTP sent successfully!'});
            } catch (error) {
                return ctx.badRequest(`Error sending OTP: ${error.message}`);
            }
        },


        async verifyOTP(ctx) {
            const {phoneNumber, otpCode} = ctx.request.body;

            // Find the OTP entry
            const otpEntry = await strapi.entityService.findMany('api::otp.otp', {
                filters: {phoneNumber, otpCode},
                limit: 1,
            });
            if (!otpEntry.length) {
                return ctx.badRequest('Invalid OTP.');
            }
            // Check if OTP is expired
            const now = new Date();
            if (new Date(otpEntry[0].expireAt) < now) {
                return ctx.badRequest('OTP expired.');
            }

            // Generate a JWT token
            const token = strapi.plugins['users-permissions'].services.jwt.issue({phoneNumber});

            // Optionally delete the OTP from the database
            await strapi.entityService.delete('api::otp.otp', otpEntry[0].id);

            return ctx.send({token});

        }

    }
));
