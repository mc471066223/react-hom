import React from "react"
import { Route } from 'react-router-dom'

import News from "../News"
import Index from "../Index";
import Profile from "../Profile";
import List from "../List";

import { TabBar } from 'antd-mobile';

import './index.scss'

const tabBarState = [
    {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
    },
    {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list'
    },
    {
        title: '咨询',
        icon: 'icon-infom',
        path: '/home/news'
    },
    {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
    }
]

class Home extends React.Component {
    state = {
        selectedTab: this.props.location.pathname,
    }

    componentDidUpdate(prevProps) {
        // 解决从nav中跳转，以及浏览器返回上一页，TabBar不会同步更新
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }

    renderTabBarItem = () => {
        return tabBarState.map(item => (
            <TabBar.Item
                title={item.title}
                key={item.title}
                icon={
                    <i className={`iconfont ${item.icon}`} />
                }
                selectedIcon={
                    <i className={`iconfont ${item.icon}`} />
                }
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                    this.setState({
                        selectedTab: item.path,
                    });
                    this.props.history.push(item.path)
                }}
            />
        ))
    }

    render() {
        return (
            <div className='home'>
                <Route exact path="/home" component={Index} />
                <Route path="/home/list" component={List} />
                <Route path="/home/news" component={News} />
                <Route path="/home/profile" component={Profile} />

                <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent={true}
                >
                    {
                        this.renderTabBarItem()
                    }
                </TabBar>

                {/* <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent={true}
                >
                    <TabBar.Item
                        title="首页"
                        key="Index"
                        icon={
                            <i className="iconfont icon-ind" />
                        }
                        selectedIcon={
                            <i className="iconfont icon-ind" />
                        }
                        selected={this.state.selectedTab === '/home'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home',
                            });
                            this.props.history.push('/home')
                        }}
                        data-seed="logId"
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <i className="iconfont icon-findHouse" />
                        }
                        selectedIcon={
                            <i className="iconfont icon-findHouse" />
                        }
                        title="找房"
                        key="List"
                        selected={this.state.selectedTab === '/home/list'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/list',
                            });
                            this.props.history.push('/home/list')
                        }}
                        data-seed="logId1"
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <i className="iconfont icon-infom" />
                        }
                        selectedIcon={
                            <i className="iconfont icon-infom" />
                        }
                        title="咨询"
                        key="News"
                        selected={this.state.selectedTab === '/home/news'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/news',
                            });
                            this.props.history.push('/home/news')
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <i className="iconfont icon-my" />
                        }
                        selectedIcon={
                            <i className="iconfont icon-my" />
                        }
                        title="我的"
                        key="Profile"
                        selected={this.state.selectedTab === '/home/profile'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/profile',
                            });
                            this.props.history.push('/home/profile')
                        }}
                    >
                    </TabBar.Item>
                </TabBar> */}
            </div>
        )
    }
}

export default Home