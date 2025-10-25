[FindlyJob.postman_collection.json](https://github.com/user-attachments/files/23144342/FindlyJob.postman_collection.json)# APIs_BackEnd

This project is Back-End project 
As it has a fully APIs with connecting with Neon (PostgreSQL)
As it for Job site

Resource :
Exceel Sheet For System and APIs design >> https://1drv.ms/x/c/79f76ce63334d821/Ecu_dkYLDo1OvyV5Po5CrI4BWWm-qaIsxL3pQM7TG9VDGw?e=0MF8z8



Foucs : 
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
11- Get owns comments
12- Like on post
13- unlike on post 
14- Follow another user
15 - unfollow another user
16- get all post for all user that you followed
17- get all post you posted

In project is i meant  to make a fully a system design for all tables 

Security :
 - Added Middlewares (auth , authz)

 I added permissions and role for each user and warp each handler with proper permission to make only authz peron to create and manage data 
 and add auth to check JWT token to check whos this user and whats permissions he/she has via payload.


Performance and scalability on DB and APIs :

As : i create index on users , posts , comments to make the query performance so instant and quickly as we know the indexed make it speed queries for filrering and search so speed  based on B-tree as not as liner 

so liner > takes O(n)
now based on B-tree it will take O(Logn) >> So it improve the performance

And i decided to Patitions on posts and users and PUT uniqueness  on email and phone number as global one not working so we need always put uniqueness  on patitions level   on hash(id) to set users when they are created their accounts based on partitions as that lead to less of load on tables , easy to filter on users , Scalability ,query performance , maintainability 

so again  >> create unique constraints on the partitions. on email and phone number That will guarantee uniqueness within each partition, but not global uniqueness


and it is helps in Horizontal scaling >> handle multi data across nodes/servers and do it by partitions within the same database/server. but let be clear the postgreSQL not support the sharding like MongoDB but let is say partitions will be help to reduce the load and searching on resouces 

Decided to put for Modules for now as it is small app for now and in the future wehen the app grows we can scaling it to has more than MODULUS : 
Small app → MODULUS 4 by hash(id)

During working on following table in a little a bit i decided to add partitions on follows table but thats was wrong decisions bec thats will lead on duplicate ids and make other people following each other as infinte loop 


also during a design a system i decided to add on cnflict via insert  on the following  table as checking that  the following and follower not able to dublicate each other again in the table at all and and check constraint "check(following_id <> follower_id)" on table via creating to not able  the following and follower to  be the SAME PERSON as follow himself/herself

but on likes i decided to put also on conflict via insert table as make sure the post_id and user_id not dublicated on table but here in general the user can put on his/her post like so i did not prevent that 


i decided to not put partitions on comments or another tables for now to make it simple 

as "Don't Partition Untill you have scaling problem "

so decided to design for partitions as comments,follows,likes will be on created_at (time)
to make filtering so easy on them and decided on time as thats will be so effecient and need to take into consideration to search on last 3 months that user commented OR deleted the Old data so i am sure the partitions based on "created_at" time  will good and achieve the goal 

APIs-Collection : 
[Uploading FindlyJob.postman_coll{
	"info": {
		"_postman_id": "e9af550d-620a-4699-8a56-5076f625069e",
		"name": "FindlyJob",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "43368446"
	},
	"item": [
		{
			"name": "users",
			"item": [
				{
					"name": "/login",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n \r\n  \"email\":\"marwa@gmail.com\" ,\r\n  \"password\": \"123\"",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/users/login",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"users",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "/register",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": " { \"userName\": \"marwa\", \r\n  \"age\":22 ,\r\n  \"country\": \"jjj\",\r\n  \"phoneNumber\": 987654345 ,\r\n  \"email\":\"marwa466644@gmail.com\" ,\r\n  \"password\": \"123\",\r\n  \"role_id\":1\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/users/register",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"users",
								"register"
							]
						}
					},
					"response": []
				},
				{
					"name": "/restPassword",
					"request": {
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"password\" : \"123477\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/users/restPassword?email=marwa444@gmail.com",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"users",
								"restPassword"
							],
							"query": [
								{
									"key": "email",
									"value": "marwa444@gmail.com"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "/deactivatedUser",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5IjoiampqIiwidXNlcklEIjoxMywicm9sZSI6eyJwZXJtaXNzaW9ucyI6WyJjcmVhdGUiLCJyZWFkIiwidXBkYXRlIiwiZGVsZXRlIl19LCJpYXQiOjE3NjE0MTg1MDcsImV4cCI6MTc2MjAyMzMwN30.15NaeDAhpnkMQO13Tfp7fLjkrcdO1YPNiDhY5KqDm_g",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"password\" : \"1234\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/users/deactivateUser?userId=9",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"users",
								"deactivateUser"
							],
							"query": [
								{
									"key": "userId",
									"value": "9"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "/ProfileUser",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"password\" : \"1234\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/users/8",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"users",
								"8"
							]
						}
					},
					"response": []
				},
				{
					"name": "/UpdateProfile",
					"request": {
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n  \"userName\" : \"marwa\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/users/8",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"users",
								"8"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "posts",
			"item": [
				{
					"name": "/post",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5IjoiampqIiwidXNlcklEIjoxMywicm9sZSI6eyJwZXJtaXNzaW9ucyI6WyJjcmVhdGUiLCJyZWFkIiwibWFuYWdlIiwidXBkYXRlIl19LCJpYXQiOjE3NjE0MDQ3MzEsImV4cCI6MTc2MjAwOTUzMX0.0soaV9yUyN7bhDfzMPpnNKEGR49-5qThS6qbXheJ-hE",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5IjoiampqIiwidXNlcklEIjoxMywicm9sZSI6eyJwZXJtaXNzaW9ucyI6WyJjcmVhdGUiLCJyZWFkIiwibWFuYWdlIiwidXBkYXRlIl19LCJpYXQiOjE3NjE0MDQ3MzEsImV4cCI6MTc2MjAwOTUzMX0.0soaV9yUyN7bhDfzMPpnNKEGR49-5qThS6qbXheJ-hE",
								"name": "authorization",
								"type": "text"
							},
							{
								"key": "Cache-Control",
								"value": "no-cache",
								"name": "cache-control",
								"type": "text"
							},
							{
								"key": "Postman-Token",
								"value": "<calculated when request is sent>",
								"name": "postman-token",
								"type": "text"
							},
							{
								"key": "Content-Type",
								"value": "application/json",
								"name": "content-type",
								"type": "text"
							},
							{
								"key": "Content-Length",
								"value": "<calculated when request is sent>",
								"name": "content-length",
								"type": "text"
							},
							{
								"key": "Host",
								"value": "<calculated when request is sent>",
								"name": "host",
								"type": "text"
							},
							{
								"key": "User-Agent",
								"value": "PostmanRuntime/7.39.1",
								"name": "user-agent",
								"type": "text"
							},
							{
								"key": "Accept",
								"value": "*/*",
								"name": "accept",
								"type": "text"
							},
							{
								"key": "Accept-Encoding",
								"value": "gzip, deflate, br",
								"name": "accept-encoding",
								"type": "text"
							},
							{
								"key": "Connection",
								"value": "keep-alive",
								"name": "connection",
								"type": "text"
							},
							{
								"key": "authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5IjoiampqIiwidXNlcklEIjoxMywicm9sZSI6eyJwZXJtaXNzaW9ucyI6WyJjcmVhdGUiLCJyZWFkIiwibWFuYWdlIiwidXBkYXRlIl19LCJpYXQiOjE3NjE0MDQ3MzEsImV4cCI6MTc2MjAwOTUzMX0.0soaV9yUyN7bhDfzMPpnNKEGR49-5qThS6qbXheJ-hE",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n  \"title\" : \"test4\" , \r\n  \"description\" : \"test\",\r\n  \"benefits\": \"test\" ,\r\n  \"qualifications\": \"test\" ,\r\n  \"salary\" : 1000, \r\n  \"typeOfJob\": \"Full-Time\" ,\r\n  \"workingHours\":9 , \r\n  \"phoneNumber\":34567876 ,\r\n  \"email\": \"test4@gmail.com\" , \r\n  \"users_id\" :8\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/posts",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts"
							]
						}
					},
					"response": []
				},
				{
					"name": "/posts?limit=&page=",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5IjoiampqIiwidXNlcklEIjoxMywicm9sZSI6eyJwZXJtaXNzaW9ucyI6WyJjcmVhdGUiLCJyZWFkIiwibWFuYWdlIiwidXBkYXRlIl19LCJpYXQiOjE3NjE0MDQ3MzEsImV4cCI6MTc2MjAwOTUzMX0.0soaV9yUyN7bhDfzMPpnNKEGR49-5qThS6qbXheJ-hE",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/posts?limit=10&page=1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts"
							],
							"query": [
								{
									"key": "limit",
									"value": "10"
								},
								{
									"key": "page",
									"value": "1"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "/posts/:id",
					"request": {
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"title\" : \"marwa\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/posts/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "/posts/:id",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/posts/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "/posts/search",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/posts/search?Keyword=qe&tag=contract&sort=DESC&limit=10&page=1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts",
								"search"
							],
							"query": [
								{
									"key": "Keyword",
									"value": "qe"
								},
								{
									"key": "tag",
									"value": "contract"
								},
								{
									"key": "sort",
									"value": "DESC"
								},
								{
									"key": "limit",
									"value": "10"
								},
								{
									"key": "page",
									"value": "1"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "/posts/filter?salary=",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/posts/filter?salary=500",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts",
								"filter"
							],
							"query": [
								{
									"key": "salary",
									"value": "500"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "/posts/:id",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/posts/11",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"posts",
								"11"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "comments",
			"item": [
				{
					"name": "/comments",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n \r\n \"comment\" : \"marwa\",\r\n \"post_id\": 3,\r\n \"user_id\" :2\r\n  \r\n  \r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/comments",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"comments"
							]
						}
					},
					"response": []
				},
				{
					"name": "/comments/:id",
					"request": {
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"comment\" : \"add comment\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/comments/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"comments",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "/comments/:id",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/comments/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"comments",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "/comments/:postId",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/comments/2",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"comments",
								"2"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "following",
			"item": [
				{
					"name": "/follows",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n \r\n \"following_id\" : 3,\r\n \"follower_id\" :1\r\n\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/follows/",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"follows",
								""
							]
						}
					},
					"response": []
				},
				{
					"name": ":following_id/unfollow",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/follows/3/unfollow?follower_id=1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"follows",
								"3",
								"unfollow"
							],
							"query": [
								{
									"key": "follower_id",
									"value": "1"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "/feeds/:followerID",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/follows/feeds/3",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"follows",
								"feeds",
								"3"
							]
						}
					},
					"response": []
				},
				{
					"name": "/myPosts/:followerID",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/follows/myPosts/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"follows",
								"myPosts",
								"1"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "likes",
			"item": [
				{
					"name": "/likes",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n \"user_id\" :1 ,\r\n \"post_id\" :5\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/likes/",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"likes",
								""
							]
						}
					},
					"response": []
				},
				{
					"name": "likes/:postID?userID=",
					"request": {
						"method": "DELETE",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "text"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/likes/5?userID=1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"likes",
								"5"
							],
							"query": [
								{
									"key": "userID",
									"value": "1"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "roles",
			"item": [
				{
					"name": "/roles",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n \"role_name\": \"guest\" ,\r\n \"permissions\" : [\"read\"]\r\n\r\n\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/roles",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"roles"
							]
						}
					},
					"response": []
				},
				{
					"name": "roles?roleId=",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/roles/17",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"roles",
								"17"
							]
						}
					},
					"response": []
				}
			]
		}
	]
}ection.json…]()


