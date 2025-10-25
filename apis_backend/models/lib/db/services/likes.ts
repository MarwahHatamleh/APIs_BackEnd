import pool from "..";

// CREATE TABLE LIKES (
//      id SERIAL PRIMARY KEY NOT NULL,
//       user_id INTEGER,
//        post_id INTEGER,
//   likes_count INTEGER DEFAULT 0,
//       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//       FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
//      UNIQUE (user_id, post_id ,id)
// )




export type likes = {
  user_id: number;
  post_id: number;
};

export const like = async (like: likes) => {
  const result = await pool.query(
    "INSERT INTO likes (user_id , post_id) values ($1 , $2) on CONFLICT (user_id , post_id ) DO UPDATE SET user_id = EXCLUDED.user_id , post_id = EXCLUDED.post_id WHERE likes.user_id = $1 AND likes.user_id = $2 RETURNING *",
    [like.user_id, like.post_id]
  );
  if(result.rowCount !== 0){
  await pool.query(
    "UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING *",
    [like.post_id]
  );}
  return result.rows;
};

export const unlike = async (id : number , user_id : number) => {
  const result = await pool.query("DELETE FROM likes WHERE post_id = $1 AND user_id= $2  RETURNING *", [id , user_id]);

  await pool.query(
    "UPDATE posts SET likes_count = GREATEST (likes_count - 1  , 0) WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows;
};
