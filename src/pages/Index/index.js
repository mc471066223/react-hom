import React from 'react';

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import axios from 'axios'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import { getCurrentCity } from '../../utils';

import './index.scss'

const navState = [
    {
        title: '整租',
        img: Nav1,
        id: 1,
        path: '/home/list'
    },
    {
        title: '合租',
        img: Nav2,
        id: 2,
        path: '/home/list'
    },
    {
        title: '地图找房',
        img: Nav3,
        id: 3,
        path: '/map'
    },
    {
        title: '去出租',
        img: Nav4,
        id: 4,
        path: '/home/list'
    }
]

// navigator.geolocation.getCurrentPosition(position => {
//     console.log(position)
// })

class Index extends React.Component {
    state = {
        swipers: [],
        swiperLoaded: false,
        groups: [],
        news: [],
        curCityName: '上海'
    }
    async getSwipers() {
        const res = await axios.get('http://49.232.149.129:8080/home/swiper');
        console.log(res);
        this.setState({
            swipers: res.data.body,
            swiperLoaded: true
        })
    }

    async getGroups() {
        const res = await axios.get('http://49.232.149.129:8080/home/groups', {
            params: {
                area: 'AREA|88cff55c-aaa4-e2e0'
            }
        })

        this.setState({
            groups: res.data.body
        })
        console.log('租房小组数据：', this.state.groups)
    }

    async getNews() {
        const res = await axios.get('http://49.232.149.129:8080/home/news', {
            params: {
                area: 'AREA|88cff55c-aaa4-e2e0'
            }
        });
        this.setState({
            news: res.data.body
        })
        console.log('最新资讯数据：', this.state.news)
    }

    async componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        // 通过百度地图API定位当前所在位置
        const curCity = await getCurrentCity();
        this.setState({
            curCityName: curCity.label
        })
    }

    renderSwiper = () => {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{ display: 'block', width: '100%' }}
            >
                <img
                    src={`http://49.232.149.129:8080${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))
    }

    renderNavs = () => {
        return navState.map(item => (
            <Flex.Item key={item.id} onClick={() => { this.props.history.push(item.path) }}>
                <img src={item.img} alt="" />
                <h2>{item.title}</h2>
            </Flex.Item>
        ))
    }

    renderNews = () => {
        return this.state.news.map(item => (
            <Flex key={item.id} className="news-item" align="stretch">
                <img src={`http://49.232.149.129:8080${item.imgSrc}`} alt="" />
                <Flex className="news-item-desc" direction="column" align="stretch" justify="between">
                    <p className="news-item-title">{item.title}</p>
                    <Flex justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </Flex>
        ))
    }

    render() {
        const { swipers, swiperLoaded } = this.state;

        return (
            <div className="index">
                {/* 轮播图和顶部导航 */}
                <div className="swiper">
                    {
                        swiperLoaded && swipers.length > 0 ? (
                            <Carousel
                                autoplay
                                infinite
                            >
                                {this.renderSwiper()}
                            </Carousel>
                        ) : ''
                    }
                    {/* 顶部导航 */}
                    <Flex className="search-box">
                        <Flex className="search">
                            <div className="location" onClick={() => this.props.history.push('/city_list')}>
                                <span className="name">{this.state.curCityName}</span>
                                <i className="iconfont icon-arrow" />
                            </div>

                            <div className="form" onClick={() => this.props.history.push('/search')}>
                                <i className="iconfont icon-seach" />
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')} />
                    </Flex>
                </div>

                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>

                <div className="groups">
                    <h3 className="title">
                        <span>租房小组</span>
                        <a>更多</a>
                    </h3>
                    <Grid square={false} hasLine={false} columnNum={2} data={this.state.groups} renderItem={(item) => (
                        <Flex key={item.id} className="group-item" justify="around">
                            <div className="desc">
                                <p>{item.title}</p>
                                <span>{item.desc}</span>
                            </div>
                            <img src={`http://49.232.149.129:8080${item.imgSrc}`} alt="" />
                        </Flex>
                    )} />
                </div>

                <WingBlank size="md" className="news">
                    <h3 className="title">最新资讯</h3>
                    {this.renderNews()}
                </WingBlank>
            </div>
        );
    }
}

export default Index