const { User } = require("../../db/models");

class AuthService {
  static async signUp({ email, name, password }) {
    console.log("AuthService.signUp received:", { email, name, password });
    
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { 
        userName: name, 
        email, 
        password 
      },
    });

    console.log("AuthService.signUp result:", { created, userId: user?.id });
    return { user, created };
  }

  static async getUserByEmail({ email }) {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}

module.exports = AuthService;