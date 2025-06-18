import React, { lazy, Suspense, useState } from "react"; 
import { useAuth } from '../../../contexts/AuthContext';

const UserControllCreate = lazy(() => import("./UserControllCreate"));
const UserControllList = lazy(() => import("./UserControllList"));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const UserControll = () => {
  const { permissions, userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState(''); 

  const usersSubMenuItems = [
    {
      label: "Listar Usuários",
      name: "users-list",
    
      component: (
        <Suspense fallback={<div>Carregando...</div>}>
          <UserControllList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Suspense>
      ),
      permission: "usuarios_visualizar"
    },
    {
      label: "Cadastrar Usuários",
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
      return false;
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