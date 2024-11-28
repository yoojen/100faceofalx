async function paginate(req, model, options, include){
    try {
        var page = parseInt(req.query.page) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10;
        var offset = (page - 1) * pageSize;
        var sort = (req.query.sort || 'updatedAt-ASC').split('-');
        //exempting query no to pass page to where clause
        delete req.query.page
        delete req.query.pageSize;
        var { count, rows } = await model.findAndCountAll({
            where: options,
            include,
            offset,
            limit: pageSize,
            order: [[sort[0], sort[1]]]
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error while fetching data');
    }
    return { rows, count, totalPages: Math.ceil(count / pageSize), currentPage: page };
}

module.exports = paginate;