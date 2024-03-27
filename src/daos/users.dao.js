import Users from "../schemas/users.schema.js"

class UsersDAO {

  static async getUsersByEmail(email) {
    if (typeof email === 'string') {
      return await Users.findOne({ email });
    } else {
      return null; 
    }
  }

  static async getusersByCreds(email, password) {
    return await Users.findOne({ email, password }, {_id:1, first_name:1, last_name:1, age:1, email:1}).lean();

  }

  static async insert(first_name, last_name, age, email, password) {
    return await new Users({ first_name, last_name, age, email, password }).save();
  }

  static async insertOne(user) {
    
    if (!user || typeof user !== 'object' || Object.keys(user).length === 0) {
      throw new Error('Invalid user object');
    }

    
    if (!user.first_name || !user.email || !user.age) {
      throw new Error('Invalid user properties');
    }

    
    if (!user.last_name) {
      user.last_name = "GitHubUser";
    }
    if (!user.password) {
      
      user.password = "GitHubUser123"; 
    }

    
    try {
      return await new Users(user).save();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      throw error;
    }
  }



  static async getUsersById(id) {
    return await Users.findOne({ _id: id }, { first_name: 1, last_name: 1, age: 1, email: 1, }).lean();
  }


}

export default UsersDAO;