import moment from 'moment';
import { useState } from 'react';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import http from '../../services/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Layout, List, Typography, Avatar, Divider, Skeleton, Input, Empty } from 'antd';
const { Title } = Typography;
const { Header, Content } = Layout;
const User = () => {
    const initialState = {
        searchText: undefined,
        pagination: { skip: 1, count: 0, take: 10 }
    }
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialState);

    const getUsers = (params, isDrop) => {
        let { searchText, pagination } = params
        pagination.skip = isDrop ? pagination.skip + 1 : 1
        if (loading) return;
        setLoading(true);
        http.get(`search/users?q=${searchText}&page=${pagination.skip}&per_page=${pagination.take}`).then((res) => {
            const prevHistory = JSON.parse(localStorage.getItem('history'));
            const result = isDrop ? [...data, ...res.data.items] : res.data.items;
            const text = { text: searchText, created_at: moment().format('DD.MM.YYYY HH:mm') }
            let history = prevHistory === null ? [text] : [...prevHistory, text];
            setData(result);
            setLoading(false);
            console.log(prevHistory);
            !isDrop && localStorage.setItem('history', JSON.stringify(history));
            setFilters(prevState => ({
                ...prevState,
                pagination: { ...pagination, count: res.data.total_count }
            }))
        }).catch(() => {
            setLoading(false);
        })
    }
    const onSearchText = debounce((value) => {
        if (value) {
            const params = { ...filters, searchText: value }
            setFilters(params)
            getUsers(params, false)
        } else {
            setData([]);
            setFilters(initialState);
        }
    }, 500)
    return (
        <Layout>
            <Layout>
                <Header className="header">
                    <Title>Search user</Title>
                </Header>
                <Content className='content infinite' id="scrollableDiv">
                    <Input.Search size='large' onChange={e => onSearchText(e.target.value)} placeholder="Search here..." />
                    {data.length > 0 ?
                        <InfiniteScroll
                            dataLength={data.length}
                            scrollableTarget="scrollableDiv"
                            next={() => getUsers(filters, true)}
                            hasMore={data.length < filters?.pagination?.count}
                            loader={<Skeleton avatar paragraph={{ rows: 1 }} />}
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}>
                            <List
                                dataSource={data}
                                renderItem={item => (
                                    <Link to={{
                                        user: item,
                                        pathname: `user/${item.login}`
                                    }}>
                                        <List.Item key={item.id}>
                                            <List.Item.Meta
                                                title={item.login}
                                                description={item.type}
                                                avatar={<Avatar src={item.avatar_url} />}
                                            />
                                        </List.Item>
                                    </Link>
                                )}
                            />
                        </InfiniteScroll>
                        : <Empty className='empty'
                            description={<span> Information is not available </span>}
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        />}
                </Content>
            </Layout>
        </Layout>
    )
}
export default User