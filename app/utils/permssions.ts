module.exports = {
  permissions: [
    // Administrator
    {
      role: "admin",
      Api_users: [
        "getInfo",
        "updateInfo",
        "getAll",
        "getOne",
        "post",
        "put",
        "delete",
      ],
      Api_courses: ["getAll", "getOne", "post", "put", "delete"],
      Api_categories: ["getAll", "getOne", "post", "put", "delete"],
    },
    // Teacher
    {
      role: "teacher",
      Api_users: ["getInfo", "updateInfo"],
      Api_courses: [
        "getAttached",
        "getAttachedOne",
        "postAttached",
        "putAttached",
        "deleteAttached",
      ],
      Api_categories: [],
    },
    // Student
    {
      role: "student",
      Api_users: ["getInfo", "updateInfo"],
      Api_courses: ["getAttached", "getAttachedOne"],
      Api_categories: [],
    },
    // Guest
    {
      role: "guest",
      Api_users: [],
      Api_courses: [],
      Api_categories: [],
    },
  ],
};

// module.exports = {
//   roles: ["admin", "teacher", "student", "guest"],
//   permissions: [
//     // Administrator
//     {
//       role: "admin",
//       rights: [
//         {
//           api: "users",
//           methods: [
//             "getInfo",
//             "updateInfo",
//             "getAll",
//             "getOne",
//             "post",
//             "put",
//             "delete",
//           ],
//         },
//         {
//           api: "courses",
//           methods: ["getAll", "getOne", "post", "put", "delete"],
//         },
//         {
//           api: "categories",
//           methods: ["getAll", "getOne", "post", "put", "delete"],
//         },
//       ],
//     },
//     // Teacher
//     {
//       role: "teacher",
//       rights: [
//         {
//           api: "users",
//           methods: ["getInfo", "updateInfo"],
//         },
//         {
//           api: "courses",
//           methods: [
//             "getAttached",
//             "getAttachedOne",
//             "postAttached",
//             "putAttached",
//             "deleteAttached",
//           ],
//         },
//         {
//           api: "categories",
//           methods: [],
//         },
//       ],
//     },
//     // Student
//     {
//       role: "student",
//       rights: [
//         {
//           api: "users",
//           methods: ["getInfo", "updateInfo"],
//         },
//         {
//           api: "courses",
//           methods: ["getAttached", "getAttachedOne"],
//         },
//         {
//           api: "categories",
//           methods: [],
//         },
//       ],
//     },
//     // Guest
//     {
//       role: "guest",
//       rights: [
//         {
//           api: "users",
//           methods: [],
//         },
//         {
//           api: "courses",
//           methods: [],
//         },
//         {
//           api: "categories",
//           methods: [],
//         },
//       ],
//     },
//   ],
// };
