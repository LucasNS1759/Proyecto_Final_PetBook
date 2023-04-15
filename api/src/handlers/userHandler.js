const bcryptjs = require('bcryptjs'); // npm i bcryptjs
const { User } = require('../DataBase/db');


const userHandlerGet = async (req, res) => {
    try {
        const { limit = 5, from = 0 } = req.query;
       
        const [totalRecords, users] = await Promise.all([
            User.count({where: {status: true}}),
            User.findAll({
                where: {status: true},
                limit: Number.parseInt(limit,10),
                offset: Number.parseInt(from,10),
            })
        ])

        res.status(200).json({totalRecords, users});

    } catch (error) {
        res.status(404).json({error: error.message});
    }
};

const userHandlerPost = async (req, res) => {
    try {
        
        const {nickname, email, password, role} = req.body;
        const newUser = {nickname, email, password, role};

        // encrypt password
        const salt = bcryptjs.genSaltSync(); // 10 rounds by default - bcryptjs method
        newUser.password = bcryptjs.hashSync( password, salt ); // bcryptjs method to encrypt
        
        //save in db
        const savedUser = await User.create(newUser)
        
        res.status(200).json({savedUser})

    } catch (error) {
        res.status(404).json({error: error.message});
    }
};

const userHandlerPut = async (req, res) => {
    try {
        const id = req.params.id;
        const {password, google, email, ...rest} = req.body;

        // TODO validate vs db
        if ( password ) {
            const salt = bcryptjs.genSaltSync(); // 10 rounds by default - bcryptjs method
            rest.password = bcryptjs.hashSync( password, salt ); // bcryptjs method to encrypt
        }

        const updatedUser = await User.update(rest, {
            where: { id },
            returning: true,
            plain: true
        });

        res.status(200).json({updatedUser})
    } catch (error) {
        res.status(500).json({msg: 'internal server error'});
    }
    
};

const userHandlerDelete = async (req, res) => {
    try {
        const { id } = req.params;
        // code to delete permanently not recommended, we need to see who modifies db
        //const deletedUser = await User.destroy({where: {id: id}})
        
        // we better disable the user by changing the status to false and not showing it in get route
        const disableUser = await User.update({ status: false }, {
            where: { id: id },
            returning: true,
            plain: true
        });

        res.status(200).json({disableUser})
    } catch (error) {
        res.status(404).json({error: error.message});
    }
};

module.exports = {
    userHandlerGet,
    userHandlerPost,
    userHandlerPut,
    userHandlerDelete
}