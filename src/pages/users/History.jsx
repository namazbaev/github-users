import http from '../../services/index';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Layout, List, Typography, Button, Empty } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography
const History = () => {
    const params = useParams();
    const location = useLocation();
    const { username } = params
    const json = JSON.parse(localStorage.getItem('history'))
    const [data, setData] = useState(json || []);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ skip: 1, take: 10 });
    const gets = () => {
        http.get(`users/${username}/repos?page=${pagination.skip}&per_page=${pagination.take}`).then((res) => {
            console.log('repos', res.data);
            setData([...data, ...res.data]);
            setLoading(false)
            setPagination({ ...pagination, skip: pagination.skip + 1 })
        }).catch(() => {
            setLoading(false);
        })
    }
    useEffect(() => {
        gets()
    }, [])
    const clear = () => {
        localStorage.clear();
        window.location.reload()
    }
    return (
        <Layout>
            <Layout>
                <Header className="header">
                    <Title>History</Title>
                </Header>
                <Content id="scrollableDiv" className='content infinite'>
                    {data.length > 0 ?
                        <List dataSource={data}
                            renderItem={(item, i) => (
                                <List.Item key={item}
                                    actions={[<div>{item.created_at}</div>]}>
                                    <List.Item.Meta title={<div>{i + 1 + '. '}{item.text}</div>} />
                                </List.Item>
                            )}
                        />
                        : <Empty className='empty'
                            description={<span> Information is not available </span>}
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        />}
                    {data.length > 0 && <Button onClick={clear} className='clearHistory' type='danger'>Clear history</Button>}
                </Content>
            </Layout>
        </Layout>
    )
}
export default History