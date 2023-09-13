import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

//All posts
router.get("/", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  return res.json({ message: "Posts", body: posts });
});

//Single post
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.json({ message: `Post id:${req.params}`, body: post });
  } catch (e) {
    return res.json({ message: e });
  }
});

//Create post
router.post("/", async (req: Request, res: Response) => {
  let { userId, title, content } = req.body;
  let post = await prisma.post.create({
    data: {
      title,
      content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return res.json({
    message: `Post id:${post.id} of user of id:${post.userId}`,
    body: post,
  });
});

//Edit post
router.put("/:id", async (req: Request, res: Response) => {
  try {
    let { userId, title, content } = req.body;
    let post = await prisma.post.update({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
      data: {
        title,
        content,
      },
    });

    return res.json({
      message: `Post id:${post.id}`,
      body: post,
    });
  } catch (e) {
    return res.json({ message: e });
  }
});

//Delete post
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    let { userId } = req.body;
    await prisma.post.delete({
      where: {
        id: parseInt(req.params.id),
        userId,
      },
    });
    return res.json({
      message: `Post of id:${req.params.id} has been deleted`,
    });
  } catch (e) {
    return res.json({ message: e });
  }
});

const posts = router;

export default posts;
