import React, { useContext } from "react";
import { Button, Col, Divider, Form, Input, Row, notification } from "antd";
import { loginApi } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { ArrowLeftOutlined } from "@ant-design/icons";

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;

        const res = await loginApi(email, password);
        if (res && res.data.EC === 0) {
            localStorage.setItem("token", res.access_token);

            notification.success({
                message: "Login successful",
                description: "Welcome back!",
            });

            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? "",
                }
            });

            navigate("/");
        } else {
            notification.error({
                message: "Login failed",
                description: res && res.data.EM ? res.data.EM : "Unknown error",
            });
        }
    };

    return (
        <Row justify={"center"} style={{ minHeight: '100vh', marginTop: '30px' }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{ 
                    padding: '15px', 
                    border: '1px solid #ccc', 
                    borderRadius: '5px' 
                }}>
                    <legend style={{ fontWeight: 'bold' }}>Login</legend>
                    <Form name="basic" onFinish={onFinish}  autoComplete="off" layout="vertical">
                        <Form.Item label="Email" name="email"
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Please enter your email' 
                                }, 
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email'
                                }
                            ]}>
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item label="Password" name="password"
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Please enter your password' 
                                }
                            ]}>
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to="/"><ArrowLeftOutlined /> Back to Home</Link>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        Don't have an account? <Link to={"/register"}>Register</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
};

export default LoginPage;