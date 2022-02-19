import React from 'react';
import { Layout } from 'antd';
import User from '../users/user';
import UserDetail from '../users/userDetail';
import Error404 from '../exception/Error404';
import Aside from '../../components/Sidebar/Aside'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import History from '../users/History';
const { Header, Sider, Content } = Layout
const Root = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Aside />
                <Routes>
                    <Route path='/' element={<User />} />
                    <Route path='*' element={<Error404 />} />
                    <Route path='/history' element={<History />} />
                    <Route path='/user/:username' element={<UserDetail />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default Root