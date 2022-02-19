import moment from 'moment';
import http from '../../services/index';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Layout, List, Divider, Typography } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography
const UserDetail = () => {
    const params = useParams();
    const { username } = params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ skip: 1, take: 10 });
    const getRepository = () => {
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
        getRepository()
    }, [])
    return (
        <Layout>
            <Layout>
                <Header className="header">
                    <Title>Repositories</Title>
                </Header>
                <Content id="scrollableDiv" className='content infinite'>
                    {data.length > 0 ?
                        <InfiniteScroll
                            next={getRepository}
                            dataLength={data.length}
                            scrollableTarget="scrollableDiv"
                            hasMore={data.length < 100}
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}>
                            <List
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item key={item.id}
                                        actions={[
                                            <>
                                                <div>Stargazers: {item.stargazers_count}</div>
                                                <div>{moment(item.created_at).format('DD.MM.YYYY')}</div>
                                            </>
                                        ]}>
                                        <List.Item.Meta title={item.name}
                                            description={item.description} />
                                    </List.Item>
                                )}
                            />
                        </InfiniteScroll> : 'Loading...'}
                </Content>
            </Layout>
        </Layout>
    )
}

export default UserDetail