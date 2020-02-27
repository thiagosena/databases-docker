db.createUser(
    {
        user: "user_nuclearis",
        pwd: "radtec.2015",
        roles: [
            {
                role: "readWrite",
                db: "nuclearis"
            }
        ]
    }
);