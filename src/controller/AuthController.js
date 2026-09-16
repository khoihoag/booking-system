const userServices = require('./../service/UserServices')
const catchAsync = require('./../utils/CatchAsyns')

exports.signup = catchAsync(async (req, res) => {
    const newUser = await userServices.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password_confirm: req.body.password_confirm
    });
    res.status(201).json({
        status: 'success',
        data:  newUser
    })
})