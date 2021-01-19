import React, { useState, useEffect } from "react";
import { Switch, List, Avatar, Button, notification, Modal as ModalAntd } from 'antd'
import NoAvatar from '../../../../assets/img/png/no-avatar.png';
import { EditOutlined, StopOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import Modal from '../../../Modal';
import EditUserForm from "../EditUserForm";
import { activateUserApi, getAvatarApi, deleteUserApi } from "../../../../Api/user"

import './ListUsers.scss';
import { getAccessTokenApi } from "../../../../Api/auth";

const {confirm} = ModalAntd;

export default function ListUsers(props) {
    const { usersActive, usersInactive, setReloadUsers} = props;
    const [viewUsersActives, setViewUsersActives] = useState(true);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState(null);

    return (
        <div className="list-users">
            <div className="list-users__switch">
                <Switch
                    defaultChecked
                    onChange={() => setViewUsersActives(!viewUsersActives)}
                />
                <span>
                    {viewUsersActives ? "Usuarios activos" : "Usuarios inactivos"}
                </span>
            </div>
            {viewUsersActives ? (
                <UsersActive userActive={usersActive} setIsVisibleModal={setIsVisibleModal} setModalTitle={setModalTitle} setModalContent={setModalContent} setReloadUsers={setReloadUsers} />
            ) : (
                    <UsersInactive usersInactive={usersInactive} setReloadUsers={setReloadUsers} />
                )}

            <Modal
                title={modalTitle}
                isVisble={isVisibleModal}
                setIsVisible={setIsVisibleModal}
            >
                {modalContent}
            </Modal>
        </div>
    );
}

function UsersActive(props) {
    const { userActive, setIsVisibleModal, setModalTitle, setModalContent,setReloadUsers } = props;

    const editUser = user => {
        setIsVisibleModal(true);
        setModalTitle(`Editar ${user.name ? user.name : "..."} ${user.lastname ? user.lastname : "..."} `);
        setModalContent(<EditUserForm user={user} setIsVisibleModal={setIsVisibleModal} setReloadUsers={setReloadUsers} />);
    }

    return (
        <List
            className="users-active"
            itemLayout="horizontal"
            dataSource={userActive}
            renderItem={user => <UserActive user={user} editUser={editUser} setReloadUsers={setReloadUsers}/>}
        />
    )
}

function UserActive(props) {
    const { user, editUser, setReloadUsers} = props;

    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (user.avatar) {
            getAvatarApi(user.avatar).then(response => {
                setAvatar(response);
            })
        } else {
            setAvatar(null);
        }
    }, [user])

    const desactiveUser = e => {
        const accessToken = getAccessTokenApi();

        activateUserApi(accessToken, user._id, false)
            .then(response =>{
                notification["success"]({
                    message: response
                });
                setReloadUsers(true)
            }).catch(err =>{
                notification["error"]({
                    message: err
                })
            })
    }

    const showDeleteConfirm = e =>{
        const accessToken = getAccessTokenApi();

        confirm({
            title:"Eliminando usuario",
            content:`Estas seguro que quieres eliminar a  ${user.email}?`,
            okText:"Elimniar",
            okType: "danger",
            cancelText:"Cancelar",
            onOk(){
                deleteUserApi(accessToken, user._id)
                    .then(response =>{
                        notification["success"]({
                            message: response
                        });
                        setReloadUsers(true)
                    })
                    .catch(err =>{{
                        notification["error"]({
                            message: err
                        })
                    }})
            }
        })
    }

    return (
        <List.Item
            actions={[
                <Button
                    type="primary"
                    onClick={() => editUser(user)}
                >
                    <EditOutlined />
                </Button>,
                <Button
                    type="danger"
                    onClick={desactiveUser}
                >
                    <StopOutlined />
                </Button>,
                <Button
                    type="danger"
                    onClick={showDeleteConfirm}
                >
                    <DeleteOutlined />
                </Button>

            ]}
        >
            
            <List.Item.Meta
                
                avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
                title={`
                            ${user.name ? user.name : "..."}
                            ${user.lastname ? user.lastname : '...'}
                        `}
                description={user.email}
            />

        </List.Item>
    )
}

function UsersInactive(props) {
    const { usersInactive, setReloadUsers} = props;
    return (
        <List
            className="users-active"
            itemLayout="horizontal"
            dataSource={usersInactive}
            renderItem={user => <UserInactive user={user} setReloadUsers={setReloadUsers}/>}
        />
    )
}

function  UserInactive(props){
    const { user ,setReloadUsers } = props;

    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (user.avatar) {
            getAvatarApi(user.avatar).then(response => {
                setAvatar(response);
            })
        } else {
            setAvatar(null);
        }
    }, [user])

    const activeUser = e => {
        const accessToken = getAccessTokenApi();

        activateUserApi(accessToken, user._id, true)
            .then(response =>{
                notification["success"]({
                    message: response
                });
                setReloadUsers(true)
            }).catch(err =>{
                notification["error"]({
                    message: err
                })
            })
    }
    const showDeleteConfirm = e =>{
        const accessToken = getAccessTokenApi();

        confirm({
            title:"Eliminando usuario",
            content:`Estas seguro que quieres eliminar a  ${user.email}?`,
            okText:"Elimniar",
            okType: "danger",
            cancelText:"Cancelar",
            onOk(){
                deleteUserApi(accessToken, user._id)
                    .then(response =>{
                        notification["success"]({
                            message: response
                        });
                        setReloadUsers(true)
                    })
                    .catch(err =>{{
                        notification["error"]({
                            message: err
                        })
                    }})
            }
        })
    }

    return (
<List.Item
                    actions={[
                        <Button
                            type="primary"
                            onClick={activeUser}
                        >
                            <CheckOutlined />
                        </Button>,
                        <Button
                            type="danger"
                            onClick={showDeleteConfirm}
                        >
                            <DeleteOutlined />
                        </Button>

                    ]}
                >
                
                    <List.Item.Meta
                        avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
                        title={`
                            ${user.name ? user.name : "..."}
                            ${user.lastname ? user.lastname : '...'}
                        `}
                        description={user.email}
                    />
                </List.Item>
    )
}