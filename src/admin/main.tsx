/// <reference path="../../localtypings/remoteclassroom.d.ts" />
/// <reference path="../../localtypings/simplewebrtc.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid, Button, Container, Segment, Menu, Icon } from 'semantic-ui-react';
import { StatusFeed } from "../components/Feed";
import { Users } from "../components/Users";
import { MainMenu } from "../components/Menu";

import * as SimpleWebRTC from 'simplewebrtc';

import Util from '../utils/util';

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface MainViewProps {
    history: any;
}
export interface MainViewState {
    users: RemoteUser[];
    messages: any[];
}

export class MainView extends React.Component<MainViewProps, MainViewState> {
    private pusher: any;
    private configChannel: any;
    private feedChannel: any;
    private privateChannel: any;

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            users: [],
            messages: []
        }
    }

    componentWillMount() {
        const courseId = session.course_id || '1207667';
        Pusher.logToConsole = true;
        this.pusher = new Pusher(config.PUSHER_APP_KEY, {
            encrypted: true
        });
        this.configChannel = this.pusher.subscribe('config' + courseId);
        this.feedChannel = this.pusher.subscribe('feed' + courseId);
        this.privateChannel = this.pusher.subscribe('private-ping' + courseId);
    }

    componentDidMount() {
        this.feedChannel.bind('update', (data: any) => {
            this.updateFeed();
            const studentName = data.message.fullName;
            Util.showNotification('Help needed!', `${studentName} raised his/her hand!`, data.message.avatarUrl);
        }, this);
        this.feedChannel.bind('loaded', (data: any) => {
            this.updateFeed();
        })
        this.feedChannel.bind('registered', (data: any) => {
            this.updateFeed();
        })
        this.configChannel.bind('changed', (data: any) => {
            if (data.config == 'users') {
                this.updateUsers();
            }
        })
        this.updateFeed();
        this.updateUsers();


        let webrtc = new SimpleWebRTC({
            localVideoEl: ReactDOM.findDOMNode(this.refs.local),
            remoteVideosEl: "",
            autoRequestMedia: true
            //url: 'https://your-production-signalserver.com/'
        });

        // we have to wait until it's ready
        webrtc.on('readyToCall', function () {
            // you can name it anything
            webrtc.joinRoom(Util.getCourseId() + '8791939');
        });
    }

    updateUsers() {
        Util.POSTCourse('/users')
            .then((response: Response) => {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data: any) => {
                //console.log(data);
                this.setState({ users: data });
            });
    }

    updateFeed() {
        Util.POSTCourse('/feed')
            .then((response: Response) => {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data: any) => {
                //console.log(data);
                this.setState({ messages: data });
            });
    }

    render() {
        return <div className="pusher">
            <MainMenu activeItem="main" history={this.props.history} />
            <Container>
                <Grid padded>
                    <Grid.Column width={10}>
                        <Segment raised>
                            <Users messages={this.state.messages} users={this.state.users} channel={this.privateChannel} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Segment raised>
                            <StatusFeed messages={this.state.messages} />
                        </Segment>
                    </Grid.Column>
                </Grid>

                <video className="local"
                    id="localVideo"
                    ref="local" > </video>
                <div className="remotes"
                    id="remoteVideos"
                    ref="remotes"> </div>
            </Container>
        </div>;
    }
}