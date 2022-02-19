import React from 'react'
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Sider } = Layout
const Aside = () => {
    return (
        <Sider className='aside' theme='light' width={300} breakpoint="lg">
            <Link to='/history'>Search history</Link>
        </Sider>
    )
}

export default Aside