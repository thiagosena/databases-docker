db.createUser(
    {
        user: "teste",
        pwd: "teste",
        roles: [
            {
                role: "readWrite",
                db: "teste"
            }
        ]
    }
);
