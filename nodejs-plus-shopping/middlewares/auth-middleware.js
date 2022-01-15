const jwt = require("jsonwebtoken")
const { User } = require("../models")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    const [tokenType, tokenValue] = authorization.split(' ')

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        })
        return
    }

    try {
        const { userId } = jwt.verify(tokenValue, "my-secret-key")

        User.findByPk(userId).then((user) => {
            res.locals.user = user  // locals는 utility하게 우리 마음대로 사용할 수 있다.
            next()
        })
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        })
        return
    }
}
// split에 공백문자를 이용해서 Bearer과 변조된 token값 사이의 공백을 없애서 분리시켜준다.
// 미들웨어는 반드시 next가 들어가야하는데 그 이유는 거치면서 예외처리가 되면서 그 뒤 미들웨어까지는 넘어가지 않는 형식이기 때문이다.