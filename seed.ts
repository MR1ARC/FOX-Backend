import { prisma, Role } from "./src/db/prisma"

async function seed() {
  console.log("🌱 Seeding database...")

  /* ---------------- USERS ---------------- */
  const users = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.user.create({
        data: {
          emailId: `user${i}@mail.com`,
          password: `hashed_password_${i}`,
          phoneNumber: `99900000${i}`,
          role: i === 0 ? Role.ADMIN : Role.USER,
          profile: {
            create: {
              firstName: `First${i}`,
              lastName: `Last${i}`,
              age: 18 + (i % 10),
              title: `user_${i}`,
              karma: Math.floor(Math.random() * 1000),
              sex: i % 2 === 0 ? "M" : "F"
            }
          }
        }
      })
    )
  )

  console.log(`✅ Created ${users.length} users`)

  /* ---------------- COMMUNITIES ---------------- */
  const communities = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.community.create({
        data: {
          title: `Community_${i}`,
          discription: `Description for community ${i}`,
          rules: "Be respectful",
          ownerId: users[i].userId
        }
      })
    )
  )

  console.log(`✅ Created ${communities.length} communities`)

  /* ---------------- MEMBERSHIPS ---------------- */
  for (const user of users) {
    for (const community of communities) {
      if (Math.random() > 0.5) {
        await prisma.membership.create({
          data: {
            userId: user.userId,
            communityId: community.communityId
          }
        })
      }
    }
  }

  console.log("✅ Created memberships")

  /* ---------------- POSTS ---------------- */
  const posts = []
  for (let i = 0; i < 50; i++) {
    const post = await prisma.post.create({
      data: {
        title: `Post title ${i}`,
        body: `Post body content ${i}`,
        authorId: users[i % users.length].userId,
        communityId: communities[i % communities.length].communityId
      }
    })
    posts.push(post)
  }

  console.log(`✅ Created ${posts.length} posts`)

  /* ---------------- COMMENTS ---------------- */
  const comments = []
  for (let i = 0; i < 100; i++) {
    const comment = await prisma.comment.create({
      data: {
        body: `Comment ${i}`,
        authorId: users[i % users.length].userId,
        postId: posts[i % posts.length].postId
      }
    })
    comments.push(comment)
  }

  // Nested replies
  for (let i = 0; i < 30; i++) {
    await prisma.comment.create({
      data: {
        body: `Reply ${i}`,
        authorId: users[i % users.length].userId,
        postId: posts[i % posts.length].postId,
        parentId: comments[i].commentId
      }
    })
  }

  console.log("✅ Created comments & replies")

  /* ---------------- VOTES ---------------- */
  for (const user of users) {
    for (const post of posts) {
      if (Math.random() > 0.7) {
        await prisma.vote.create({
          data: {
            userId: user.userId,
            postId: post.postId,
            value: Math.random() > 0.5 ? 1 : -1
          }
        })
      }
    }

    for (const comment of comments) {
      if (Math.random() > 0.8) {
        await prisma.vote.create({
          data: {
            userId: user.userId,
            commentId: comment.commentId,
            value: Math.random() > 0.5 ? 1 : -1
          }
        })
      }
    }
  }

  console.log("✅ Created votes")

  console.log("🎉 Database seeded successfully!")
}

seed()