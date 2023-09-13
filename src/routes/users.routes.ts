import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

interface User {
  username: string;
  password?: string;
  email: string;
  posts?: Post[];
}

interface Post {
  title: string;
  content: string;
}

//Gey users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users: User[] = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return res.json({ message: `Users`, body: users });
  } catch (e) {
    return res.json({ message: e });
  }
});

//Get single user with posts
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        posts: true,
      },
    });
    if (user === null) {
      return res.json({ message: `User of id:${req.params.id} doesnt exits.` });
    } else {
      return res.json({ message: `User id:${req.params.id}`, body: user });
    }
  } catch (e) {
    return res.json({ message: e });
  }
});

//Create user with welcoming post
router.post("/", async (req: Request, res: Response) => {
  try {
    let { username, email, password } = req.body;
    if (username !== "" && email !== "" && password !== "") {
      let user: User | null = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user === null) {
        user = await prisma.user.create({
          data: {
            username,
            email,
            password,
            posts: {
              create: {
                title: "This is my first post",
                content: "Hello and welcome...",
              },
            },
          },
        });
        return res.json({ message: "User created", body: user });
      } else {
        return res.json({ message: "Email already taken" });
      }
    } else {
      return res.json({ message: "Please provide credentials" });
    }
  } catch (e) {
    return res.json({ message: e });
  }
});

//Update user
router.put("/:id", async (req: Request, res: Response) => {
  let { userId, email, username, password } = req.body;

  if (req.params.id === userId.toString()) {
    let user: User | null = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        email,
        username,
        password,
      },
    });

    return res.json({
      message: `User of id:${req.params.id} updated!`,
      body: user,
    });
  } else {
    return res.json({ message: "You are not the user you want to change" });
  }
});

//Delete user
router.delete("/:id", async (req: Request, res: Response) => {
  let { userId } = req.body;
  if (req.params.id === userId.toString()) {
    await prisma.user.delete({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        posts: true,
      },
    });
    return res.json({
      message: `User of id:${req.params.id} deleted`,
    });
  } else {
    return res.json({ message: "You are not the user you want to change" });
  }
});

const users = router;

export default users;
