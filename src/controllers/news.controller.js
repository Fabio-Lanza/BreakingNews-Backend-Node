import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteNewsService,
  addCommentService,
  deleteCommentService,
} from "../services/news.service.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    if (!title || !text || !banner) {
      res.status(400).send({ message: "Submit all fields for registration" });
    }

    await createService({
      title,
      text,
      banner,
      user: {
        _id: req.userId,
      },
    });

    res.send(201);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 5;
    }

    if (!offset) {
      offset = 0;
    }

    const news = await findAllService(offset, limit);
    const total = await countNews();
    const currentUrl = req.baseUrl;

    console.log(news[0])
    
    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous !== null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (news.length === 0) {
      return res.status(400).send({ message: "There are no registered news" });
    }
    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      results: news?.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
         name: newsItem?.user?.name,
         username: newsItem?.user?.username,
        userAvatar: newsItem?.user?.avatar,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const topNews = async (req, res) => {
  try {
    const news = await topNewsService();

    if (!news) {
      return res.status(400).send({ message: "There is no registered post" });
    }
    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await findByIdService(id);

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "There is no news with this title" });
    }

    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const byUser = async (req, res) => {
  try {
    const id = req.userId;
    const news = await byUserService(id);

    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, banner } = req.body;
    const userId = req.userId;

    if (!title || !text || !banner) {
      res.status(400).send({ message: "Submit all fields for registration" });
    }

    const news = await findByIdService(id);

    if (String(news.user._id) != req.userId) {
      return res.status(400).send({ message: "You didn't create this post" });
    }

    await updateService(id, title, text, banner);

    return res.send({ message: "News successfully Updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const erase = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);
    console.log(typeof news.user._id, typeof req.userId);

    if (String(news.user._id) != req.userId) {
      return res.status(400).send({ message: "You didn't delete this post" });
    }

    await eraseService(id);
    return res.send({ message: "News Deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const likeNews = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const newsLiked = await likeNewsService(id, userId);

  if (!newsLiked) {
    await deleteNewsService(id, userId);
    return res.status(200).send({ message: "Like removed successful" });
  }

  res.send({ message: "like successfully" });
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const comment = req.body;

    if (!comment) {
      return res.status(400).send({ message: "Write a message to comment" });
    }
    await addCommentService(id, comment, userId);

    res.send({ message: "Comment successful created" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { idNews, idComment } = req.params;
    const userId = req.userId;

    const commentDelete = await deleteCommentService(idNews, idComment, userId);

    console.log(commentDelete);
    res.send({ message: "Comment successful Deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  create,
  findAll,
  topNews,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likeNews,
  deleteNewsService,
  addComment,
  deleteComment,
};
