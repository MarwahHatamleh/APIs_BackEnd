import pool from "../index";

export type comments = {
  comment: string;
  post_id: number;
  user_id: number;
};

/*
CREATE TABLE comments (
      id SERIAL  NOT NULL,
      comment VARCHAR(225) NOT NULL,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      post_id INTEGER,
      FOREIGN KEY (post_id) REFERENCES posts(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ,
     UNIQUE(id , created_at),
    PRIMARY KEY(id , created_at)
   ) PARTITION BY RANGE(created_at)
  
  >>>>  CREATE INDEX indx_comments_post_id_created_at ON comments(post_id , created_at)


CREATE TABLE comments_2025_01 PARTITION OF comments
  FOR VALUES FROM ('2025-01-01') TO ('2025-12-31');

CREATE TABLE comments_2026_02 PARTITION OF comments
  FOR VALUES FROM ('2025-12-31') TO ('2026-12-31');

CREATE TABLE comments_2027_03 PARTITION OF comments
  FOR VALUES FROM ('2026-12-31') TO ('2027-12-31');

CREATE TABLE comments_2028_04 PARTITION OF comments
  FOR VALUES FROM ('2027-12-31') TO ('2028-12-31');

*/

export const CreateComment = async (comment: comments) => {
  const result = await pool.query<comments>(
    `INSERT INTO comments (comment , post_id , user_id) VALUES ($1 , $3, $2) RETURNING *`,
    [comment.comment, comment.post_id, comment.user_id]
  );
  return result.rows;
};

export const DeleteComment = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM comments WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows;
};

export const UpdateComment = async (comment: comments, id: number) => {
  const result = await pool.query<comments>(
    `UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *`,
    [comment.comment, id] 
  );

  return result.rows;
};

export const GetsComments = async (id: number) => {
  const result = await pool.query<comments>(
    `SELECT * FROM comments INNER JOIN posts 
  ON  posts.id = comments.post_id
  INNER JOIN users ON users.id = comments.user_id
  WHERE posts.id = $1`,
    [id] 
  );

  return result.rows;
};
