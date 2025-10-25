import pool from "..";


//CREATE INDEX indx_posts_user_id_created_at ON posts(users_id , created_at)

// CREATE TYPE types AS ENUM ('Full-Time', 'Part-Time', 'Contract' , 'Internship');

//   CREATE TABLE posts (
//    id  SERIAL PRIMARY KEY NOT NULL,
//    title VARCHAR(225) NOT NULL,
//    description VARCHAR(225),
//    benefits VARCHAR(225),
//    qualifications VARCHAR(225),
//    salary INTEGER,
//    typeOfJob types NOT NULL,
//    workingHours VARCHAR(225) NOT NULL,
//    phoneNumber INTEGER NOT NULL ,
//    email VARCHAR(225) NOT NULL ,
//    users_id INTEGER,
//    FOREIGN KEY (users_id) REFERENCES users(id),
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
//    UNIQUE (phoneNumber, created_at , id)
// ) PARTITION BY Hash (id)



export const JobsTypes = {
  "Full-Time": "Full-Time",
  "Part-Time": "Part-Time",
  Contract: "Contract",
  Internship: "Internship",
} as const;

export type JobsTypes = (typeof JobsTypes)[keyof typeof JobsTypes];

export type posts = {
  title: string;
  description: string;
  benefits: string;
  qualifications: string;
  salary: string;
  typeOfJob: string;
  workingHours: string;
  phoneNumber: string;
  email: string;
  users_id: number;
};

export const CreatePost = async (post: posts) => {
  const result = await pool.query<posts>(
    "INSERT INTO posts (title , description , benefits , qualifications , salary , typeOfJob , workingHours , phoneNumber , email , users_id) VALUES ( $1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10) RETURNING *",
    [
      post.title,
      post.description,
      post.benefits,
      post.qualifications,
      post.salary,
      post.typeOfJob,
      post.workingHours,
      post.phoneNumber,
      post.email,
      post.users_id,
    ]
  );
  return result.rows;
};

export const DeletePost = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows;
};

export const UpdatePost = async (post: posts, id: number) => {
  const result = await pool.query<posts>(
    "UPDATE posts SET title = COALESCE($1,title) , description = COALESCE($2 , description), benefits = COALESCE($3 , benefits),qualifications =  COALESCE($4,qualifications )  , salary =COALESCE($5 , salary) , typeOfJob = COALESCE($6,typeOfJob ), workingHours = COALESCE($7, workingHours) ,phoneNumber = COALESCE($8, phoneNumber), email = COALESCE($9, email),users_id = COALESCE($10, users_id)  WHERE id = $11 RETURNING *",
    [
      post.title,
      post.description,
      post.benefits,
      post.qualifications,
      post.salary,
      post.typeOfJob,
      post.workingHours,
      post.phoneNumber,
      post.email,
      post.users_id,
      id,
    ]
  );
  return result.rows;
};

export const SearchPost = async (
  Keyword: string | null,
  tag: string | null,
  limit: number,
  sort: string | null,
  page: number
) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT * FROM posts WHERE description::text ILIKE $1 OR typeOfJob::text ILIKE $2 ORDER BY created_at ${sort} LIMIT $3 OFFSET ${offset} `,
    [`%${Keyword}%`, `%${tag}%` , limit]
  );
  return result.rows;
};

export const GetPostsByLimit = async (limit: number, page: number) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET ${offset}
     `,
    [limit]
  );

  if (result) {
    return {
      page: page,
      result: result.rows,
    };
  }
};

export const FilterPostByComments = async () => {
  const result = await pool.query(
    `SELECT * FROM posts WHERE id = ANY( SELECT post_id
    FROM comments
    GROUP BY post_id
    HAVING COUNT(*) > 3
) Order by created_at DESC`
  );
  return result.rows;
};

export const FilterPostBySalary = async (salary: number) => {
  const result = await pool.query(
    `SELECT * FROM posts WHERE salary = $1 Order by created_at DESC`,
    [salary]
  );
  return result.rows;
};
