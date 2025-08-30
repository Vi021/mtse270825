import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../utils/api";


const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserApi();
            if (!response?.message) {
                setDataSource(response);
            } else {
                notification.error({
                    message: "Unauthorized fetch",
                    description: response.message,
                });
            }
        };

        fetchUser();
    }, []);

    const columns = [
        {
            title: "Id",
            dataIndex: "_id"
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Role",
            dataIndex: "role"
        }
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Table bordered dataSource={dataSource} columns={columns} rowKey="id" />
        </div>
    );
};

export default UserPage;