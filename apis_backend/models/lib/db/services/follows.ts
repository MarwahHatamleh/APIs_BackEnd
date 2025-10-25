import pool from "../index";

// CREATE TABLE follows (
//    id SERIAL PRIMARY KEY NOT NULL,
//    following_id INTEGER NOT NULL,
//    follower_id INTEGER NOT NULL,
//    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
//    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
//    UNIQUE (follower_id, following_id),
//   CHECK (follower_id <> following_id)
// )
// PARTITION BY Hash (id)


//  CREATE TABLE follow_p0 PARTITION OF follows FOR VALUES WITH (MODULUS 4, REMAINDER 0);
//  CREATE TABLE follow_p1 PARTITION OF follows FOR VALUES WITH (MODULUS 4, REMAINDER 1);
//  CREATE TABLE follow_p2 PARTITION OF follows FOR VALUES WITH (MODULUS 4, REMAINDER 2);
//  CREATE TABLE follow_p3 PARTITION OF follows FOR VALUES WITH (MODULUS 4, REMAINDER 3);


export type follows = {
  following_id: number;
  follower_id: number;
};

export const follows = async (follow: follows) => {
  const result = await pool.query<follows>(
    "INSERT INTO follows (following_id , follower_id) values ($1 , $2) on CONFLICT (following_id , follower_id ) DO UPDATE SET following_id = EXCLUDED.following_id , follower_id = EXCLUDED.follower_id WHERE follows.following_id = $1 AND follows.follower_id = $2 RETURNING *",
    [follow.following_id, follow.follower_id]
  );
  return result.rows;
};

export const unfollow = async (following_id: number , follower_id : number) => {
  const result = await pool.query(
    "DELETE FROM follows WHERE following_id = $1 AND follower_id = $2 RETURNING *",
    [following_id , follower_id]
  );
  return result.rows;
};


export const Feeds = async(follower_id : number) =>{
   const result = await pool.query(
    "SELECT * FROM users FULL OUTER JOIN posts ON users.id = posts.users_id FULL OUTER JOIN  follows ON posts.users_id = follows.following_id WHERE following_id = ANY(SELECT following_id FROM follows WHERE follower_id = $1) ORDER BY posts.created_at DESC",
    [follower_id]
  );
  return result.rows;
}

export const GetMyPosts = async(follower_id: number) =>{
   const result = await pool.query(
    "SELECT * FROM users FULL OUTER JOIN posts ON users.id = posts.users_id WHERE users.id = $1" ,
    [follower_id]
  );
  return result.rows;
}

// export const Feeds = async (following_id: number) => {
//   const result = await pool.query(
//     "SELECT  FROM follows WHERE following_id = $1 AND follower_id = $2 RETURNING *",
//     [following_id ]
//   );
//   return result.rows;
// };