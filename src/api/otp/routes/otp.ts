export default {
    routes: [
        {
            method: 'POST',
            path: '/otp/send',
            handler: 'api::otp.otp.sendOTP',
            config: {
                auth: false, // Allow unauthenticated access
                policies: [], // Optional: Add Strapi policies
                middlewares: [], // Optional: Add middlewares
            },
        },
        {
            method: 'POST',
            path: '/otp/verify',
            handler: 'api::otp.otp.verifyOTP',
            config: {
                auth: false, // Allow unauthenticated access
                policies: [],
                middlewares: [],
            },
        },
    ],
};
