import React, { lazy, Suspense } from "react";
import { useAuth } from '../../../contexts/AuthContext';

const UserControllCreate = lazy(() => import("./UserControllCreate"));
const UserControllList = lazy(() => import("./UserControllList"));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const UserControll = () => {
  const { permissions, userRole } = useAuth();

  const usersSubMenuItems = [
    {
      label: "Listar usuários",
      name: "users-list", 
      component: <Suspense fallback={<div>Carregando...</div>}><UserControllList /></Suspense>,
      permission: "usuarios_visualizar" 
    },
    {
      label: "Criar usuários",
      name: "users-create", 
      component: <Suspense fallback={<div>Carregando...</div>}><UserControllCreate /></Suspense>,
      permission: "usuarios_criar" 
    }
  ];

  let filteredMenuComponents;

  if (userRole === "Admin") {
    filteredMenuComponents = usersSubMenuItems;
  } else {
    filteredMenuComponents = usersSubMenuItems.filter(item => {
      if (item.permission) {
        return permissions && Array.isArray(permissions) && permissions.includes(item.permission);
      }
    });

    if (filteredMenuComponents.length === 0) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
          Você não tem permissão para visualizar nenhuma seção dos usuários.
        </div>
      );
    }
  }

  return (
    <div>
      <BodgettMenu components={filteredMenuComponents} />
    </div>
  );
};

export default UserControll;
