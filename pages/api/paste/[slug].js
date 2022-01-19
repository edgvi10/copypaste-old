import DB from "@/root/src/libs/db";
import { base64 } from "@/root/src/libs/utils";
import { v4 as uuidv4 } from "uuid";

export default async (req, res) => {
    console.clear();
    const $return = {};
    $return.success = false;
    $return.message = null;

    const db = new DB({ host: "db.edapp.com.br", user: "edgvi10", password: "!Dev2Eduardo", database: "playground" });

    if (req.method === "GET") {
        const select_publish_params = {};
        select_publish_params.table = "`playground`.`copypaste` AS `copypaste`";
        select_publish_params.columns = [
            "`copypaste`.`uuid` AS `uuid`",
            "`copypaste`.`slug` AS `slug`",
            "`copypaste`.`content` AS `content`",
            "`copypaste`.`created_at` AS `created_at`",
            "`copypaste`.`update_at` AS `updated_at`"
        ];

        select_publish_params.where = [];
        select_publish_params.where.push(["`copypaste`.`slug` = '" + req.query.slug + "'"]);

        const select_publish_sql = db.buildSelect(select_publish_params);
        const select_publish = await db.execute(select_publish_sql);

        if (select_publish.success) {
            $return.success = select_publish.success;
            const paste = select_publish.data[0];
            if (paste && paste.content) paste.content = base64(paste.content).decode();
            $return.data = paste;

            res.statusCode = 200;
        } else {
            $return.success = false;
            $return.debug = select_publish;

            res.statusCode = 500;
        }

        return res.json($return);
    }
    if (req.method === "POST") {
        const folter_data = {
            uuid: uuidv4(),
            slug: req.query.slug,
            content: req.body.content,
        };

        folter_data.content = base64(folter_data.content).encode();

        const select_copypaste = await db.execute("SELECT * FROM `playground`.`copypaste` WHERE `slug` = '" + folter_data.slug + "'");
        if (select_copypaste.success) {
            if (select_copypaste.data.length > 0) {
                const update_copypaste = await db.execute("UPDATE `playground`.`copypaste` SET `content` = '" + folter_data.content + "' WHERE `slug` = '" + folter_data.slug + "'");
                if (update_copypaste.success) {
                    $return.success = true;
                    $return.message = "Updated";
                    res.statusCode = 200;
                } else {
                    $return.success = false;
                    $return.debug = update_copypaste;
                    res.statusCode = 500;
                }
            } else {
                const insert_copypaste = await db.execute("INSERT INTO `playground`.`copypaste` (`uuid`, `slug`, `content`) VALUES ('" + folter_data.uuid + "', '" + folter_data.slug + "', '" + folter_data.content + "')");
                if (insert_copypaste.success) {
                    $return.success = true;
                    $return.message = "created";
                    res.statusCode = 201;
                } else {
                    $return.success = false;
                    $return.debug = insert_copypaste;
                    res.statusCode = 500;
                }
            }
        } else {
            $return.success = false;
            $return.debug = select_copypaste;
            res.statusCode = 500;
        }

        return res.json($return);
    }

    return res.status(405).json({ ...$return, message: 'Method Not Allowed' });
}