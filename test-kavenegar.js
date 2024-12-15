var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: '6237422B34614C65344F63705A32465245735A6E4D6844704430344E54774C7944702F4771674C4F3333383D'
});

api.Send({
    message: "خدمات پیام کوتاه کاوه نگار",
    sender: "2000660110",
    receptor: "09375332212"
}, function (response, status) {
    console.log('Response:', response);
    console.log('Status:', status);
});
