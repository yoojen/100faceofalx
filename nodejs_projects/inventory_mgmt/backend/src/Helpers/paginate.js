async function paginate(req, model, options, include) {
    try {
        var page = parseInt(req.query.page) || 1;
        var pageSize = parseInt(req.query.pageSize) || 1000;
        var offset = (page - 1) * pageSize;
        var sort = (req.query.sort || 'createdAt-DESC').split('-');
        var groupby = req.query.groupby ? req.query.groupby : null;

        //exempting query no to pass page to where clause
        delete req.query.page
        delete req.query.pageSize;
        delete req.query.sort
        delete req.query.groupby

        var { count, rows } = await model.findAndCountAll({
            where: options,
            include,
            offset,
            limit: pageSize,
            order: [[sort[0], sort[1] ? sort[1].toUpperCase() : 'ASC']]
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error while fetching data');
    }
    return { rows, count, totalPages: Math.ceil(count / pageSize), currentPage: page };
}

module.exports = paginate;