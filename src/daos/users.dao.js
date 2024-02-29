import Users from "../schemas/users.schema.js"

class UsersDAO {

  static async getUsersByEmail(email) {
    return await Users.findOne({ email });
  }

  static async getusersByCreds(email, password) {
    return await Users.findOne({ email, password });

  }

  static async insert(first_name, last_name, age, email, password) {
    return await new Users({ first_name, last_name, age, email, password }).save();
  }

  static async getUsersById(id) {
    return await Users.findOne({ _id: id }, { first_name: 1, last_name: 1, age: 1, email: 1, }).lean();
  }


}

export default UsersDAO;