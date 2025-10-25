
# APIs_BackEnd

This project is Back-End project 
As it has a fully APIs with connecting with Neon (PostgreSQL)
As it for Job site

System and APIs design : https://1drv.ms/x/c/79f76ce63334d821/Ecu_dkYLDo1OvyV5Po5CrI4BWWm-qaIsxL3pQM7TG9VDGw?e=0MF8z8



#Foucs : 

1- Data Model 

2- Access patterns 

3- indexing stoarge 

4- scalability plan when the data grows

5- stoarge optimizations (like partitions)

"Anticipate Growth but keep things simple early"

Here : user is able to :

1-  Register

2 - Login

3- Rest Password 

4- Get Profile Info

5- Deactivate Account

6 - Update Profile Info

7- create a comment

8- delete a comment

9- update a comment

10- Get all comment for each job 

11- Get own comments

12- Like on post

13- unlike on post 

14- Follow another user

15 - unfollow another user

16- get all post for all user that you followed

17- get all post you posted

In project is i meant  to make a fully a system design for all tables 



#Security :

 - Added Middlewares (auth , authz)

 I added permissions and role for each user and warp each handler with proper permission to make only authz peron to create and manage data 
 and add auth to check JWT token to check whos this user and whats permissions he/she has via payload.



#Performance and scalability on DB and APIs :

- Added Indexes and Partitions 

As : i create index on users , posts , comments to make the query performance so instant and quickly as we know the indexes make the queries speed for filtering and search so speed  based on B-tree as not as liner 

so liner > takes O(n)
now based on B-tree it will take O(Logn) >> So it improve the performance

And i decided to Partitions on posts and users and PUT uniqueness  on email and phone number as global one not working so we need always put uniqueness  on patitions level   on hash(id) to set users when they are created their accounts based on partitions as that lead to less of load on tables , easy to filter on users , Scalability ,query performance, maintainability 

so again  >> create unique constraints on the partitions. on email and phone number That will guarantee uniqueness within each partition, but not global uniqueness


and it is helps in Horizontal scaling >> handle multi data across nodes/servers and do it by partitions within the same database/server. but let be clear PostgreSQL not support the sharding like MongoDB but let is say partitions will be help to reduce the load and searching on resources 

Decided to put for Modules for now as it is small app for now and in the future wehen the app grows we can scaling it to has more than MODULUS : 
Small app → MODULUS 4 by hash(id)

During working on the following table in a little a bit i decided to add partitions on follows table but thats was wrong decisions bec thats will lead on duplicate ids and make other people follow each other as infinite loop 


also during a design a system i decided to add on cnflict via insert  on the following  table as checking that  the following and follower not able to dublicate each other again in the table at all and and check constraint "check(following_id <> follower_id)" on table via creating to not able  the following and follower to  be the SAME PERSON as follow himself/herself

but on likes i decided to put also on conflict via insert table as make sure the post_id and user_id not dublicated on table but here in general the user can put on his/her post like so i did not prevent that 


i decided not to put partitions on comments or another tables for now to make it simple 

as "Don't Partition Untill you have a scaling problem "

so decided to design for partitions as comments, follows,likes will be on created_at (time)
to make filtering so easy on them and decided on time as thats will be so efficient and need to take into consideration to search on the last 3 months that user commented OR deleted the Old data so i am sure the partitions based on "created_at" time  will be good and achieve the goal 

APIs-Collection : [FindlyJob.postman_collection.json](https://github.com/user-attachments/files/23144342/FindlyJob.postman_collection.json)



DB Schema : 


<img width="679" height="681" alt="FindlyJob_DB drawio" src="https://github.com/user-attachments/assets/23e983fc-256d-45b9-8a53-052c0da5c07b" />
