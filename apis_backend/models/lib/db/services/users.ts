import pool from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Secret, SignOptions } from "jsonwebtoken";


// CREATE INDEX index_user_id ON users (id);
// CREATE INDEX index_email ON users (email);

// \d users
//\d+ users

// Create Table roles (
//   id SERIAL PRIMARY KEY ,
//   role_name VARCHAR(225),
//   permissions TEXT[]
// )
// CREATE TABLE user_p0 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 0);
// CREATE TABLE user_p1 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 1);
// CREATE TABLE user_p2 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 2);
// CREATE TABLE user_p3 PARTITION OF users FOR VALUES WITH (MODULUS 4, REMAINDER 3);

// ALTER TABLE user_p0 ADD CONSTRAINT unique_email_phoneNumber_p0 UNIQUE (email , phoneNumber);
// ALTER TABLE user_p1 ADD CONSTRAINT unique_email_phoneNumber_p1 UNIQUE (email , phoneNumber);
// ALTER TABLE user_p2 ADD CONSTRAINT unique_email_phoneNumber_p2 UNIQUE (email , phoneNumber);
// ALTER TABLE user_p3 ADD CONSTRAINT unique_email_phoneNumber_p3 UNIQUE (email , phoneNumber);

// CREATE TABLE users (
//    id SERIAL PRIMARY KEY NOT NULL,
//    username VARCHAR(225),
//    age INTEGER,
//    country VARCHAR(225),
//    phoneNumber INTEGER NOT NULL ,
//    email VARCHAR(225) NOT NULL ,
//    password VARCHAR(225) NOT NULL,
//    role_id INTEGER,
//    FOREIGN KEY (role_id) REFERENCES roles(id),
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
//      UNIQUE (phoneNumber, created_at , email , id)
// ) PARTITION BY Hash (id)


export type RegisterUser = {
  id?: number;
  userName: string;
  age: number;
  country: string;
  phoneNumber: string;
  email: string;
  password: string;
  role_id: number;

};

export type LoginUser = {
  email: string;
  password: string;
};

export type UpdateUserInfo = {
  userName: string;
  age: number;
  country: string;
  phoneNumber: string;
  email: string;
  password: string;
  role_id: number;
};

const hashPassword = async (password: string) => {
  const result =  await bcrypt.hash(password, 10);
  return result;
};

const comparePasswords = async (password: string, hashedPassword: string) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};

export const Register = async (newUser: RegisterUser) => {
  const results = await pool.query<RegisterUser>(
    "INSERT INTO users (userName , age ,country , phoneNumber , email , password , role_id) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 ) RETURNING *",
    [
      newUser.userName,
      newUser.age,
      newUser.country,
      newUser.phoneNumber,
      newUser.email.toLowerCase(),
      await hashPassword(newUser.password),
      newUser.role_id,
    ]
  );

  const user = results.rows[0];
  // const token = jwt.sign(
  //   {
  //     userId: user.id,
  //     email: user.email,
  //     role: user.role_id,
  //     permissions: user.permissions,
  //   },
  //   process.env.NEXTAUTH_SECRET as Secret,
  //   {
  //     expiresIn: "7d",
  //   }
  // );
  const token = await generateTokens(user);

  if (user) {
    return {
      id: user.id,
      userName: user.userName,
      age: user.age,
      country: user.country,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      role_id: user.role_id,
      token: token,
    };
  }
};

export const Login = async (email: string, password: string) => {
  const results = await pool.query("SELECT * from users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  const user = results.rows[0];
  const hashedPassword = user.password;
  const isMatch = await comparePasswords(password, hashedPassword);

  if (!isMatch) {
    throw new Error("Please check the password");
  } else {
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email, role: user.role_id },
    //   process.env.SECRET as Secret,
    //   {
    //     expiresIn: "7d",
    //   }
    // );
    const token = await generateTokens(user);
    return {
      id: user.id,
      userName: user.userName,
      age: user.age,
      country: user.country,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password,
      role_id: user.role_id,
      token: token,
    };
  }
};
export const RestPassword = async (password: string, email: string) => {
  const result = await pool.query(
    "UPDATE users SET password = $1 WHERE email =$2 RETURNING *",
    [await hashPassword(password), email]
  );
  return result.rows;
};

export const GetUsers = async () => {
  const result = await pool.query(
    "SELECT * from users"
  );
  return result.rows;
};

export const profileInfo = async (id: number) => {
  const result = await pool.query(
    "SELECT * From users WHERE id = $1",
    [id]
  );
  return result.rows;
};

export const DeactivateUser = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows;
};

export const UpdateUserInfo = async (
  id: number,
  updateInfo: UpdateUserInfo
) => {
  const result = await pool.query(
    "UPDATE users SET userName = COALESCE($1,userName) , age = COALESCE($2 , age), country = COALESCE($3 , country),phoneNumber =  COALESCE($4,phoneNumber )  , email =COALESCE($5 , email) , password = COALESCE($6,password ), role_id = COALESCE($7, role_id)  WHERE id = $8 RETURNING *",
    [
      updateInfo.userName,
      updateInfo.age,
      updateInfo.country,
      updateInfo.phoneNumber,
      updateInfo.email,
      updateInfo.password,
      updateInfo.role_id,
      id,
    ]
  );
  return result.rows;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateTokens = async (user: any) => {
  let returnValue;
  if (user !== null) {
    const id = user.role_id;
    const result = await pool.query(`SELECT * FROM roles WHERE id = ${id}`);
    const payload = {
      country: user.country,
      userID: user.id,
      role: {
        role: result.rows[0].role_id,
        permissions: result.rows[0].permissions,
      },
    };
    returnValue = jwt.sign(
      payload,
      process.env.JWT_SECRET as Secret,

      {
        expiresIn: "7d",
      }
    );
  } else {
    returnValue = "Sorry there is no any role for this email";
  }
  return returnValue;
  // let returnValue;
  // if (user !== null) {
  //   const id = user.role;
  //   const role = await roleModel.findOne({ _id: id }).exec();
  //   console.log(role);
  //   const payload = {
  //     country: user.country,
  //     userID: user._id,
  //     role: {
  //       role: role.role,
  //       permissions: role.permissions,
  //     },
  //   };
  //   const options = {
  //     expiresIn: TOKEN_EXP_Time,
  //   };
  //   returnValue = jwt.sign(payload, SECRET, options);
  // } else {
  //   returnValue = "Sorry there is no any role for this email";
  // }
  // console.log(returnValue);
  // return returnValue;
};
