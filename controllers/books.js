const BookModel = require("../models/book");
const { Op } = require("sequelize");

const paginate = (page = 1, pageSize = 10) => {
  // pageSize - no. of records per page
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
};

exports.getBooks = async (req, res) => {
  try {
    // get query params
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const search = req.query.search;

    const searchQuery = search
      ? {
          where: {
            // Note: below code is inspired from stackoverflow
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                author: {
                  [Op.like]: `%${search}`,
                },
              },
            ],
            //   ends here
          },
        }
      : {};

    // filter books if search exist in params else get all books with pagination
    const { count, rows: books } = await BookModel.findAndCountAll({
      ...searchQuery,
      ...paginate(page),
    });

    return res
      .status(200)
      .json({ books, page: page, pages: Math.ceil(count / 10) });
  } catch (err) {
    return res.status(500).json({ error: "Somthing Went Wrong: " + err });
  }
};

exports.addBook = async (req, res) => {
  try {
    // get the req body
    const bookObj = req.body;
    const book = await BookModel.create(bookObj);
    return res.status(201).json({ message: "Book Added!", bookId: book.id });
  } catch (err) {
    return res.status(500).json({ error: "Something Went Wrong: " + err });
  }
};
