import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { LayoutDashboard, PieChart, Wallet, User, Bell, ArrowUp, ArrowDown, UtensilsCrossed, Fuel, Lightbulb, DollarSign, CreditCard, Landmark, Mic, Home, ShoppingCart, Plus, Edit, Tag, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE ---
// PASSO FUTURO: Irá substituir este bloco de exemplo pela sua chave pessoal do Firebase.
// Não se preocupe com isto agora, vamos gerar esta chave no guia passo a passo.
const firebaseConfig = {
  apiKey: "AIzaSyD-X9XmO9a6-G51nJSx5xTeMwWj2zWzJfk",
  authDomain: "dindin-f1b9d.firebaseapp.com",
  projectId: "dindin-f1b9d",
  storageBucket: "dindin-f1b9d.firebasestorage.app",
  messagingSenderId: "851819038246",
  appId: "1:851819038246:web:846082caf6bb66f153c8e7"
};

// O resto do código funciona automaticamente.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DADOS MOCK (Simulação de dados para telas ainda não conectadas) ---
const reportsData = {
    totalIncome: '10.000,00',
    totalExpenses: '2.419,50',
    spendingByCategory: [
        { name: 'Moradia', amount: '950,00', percentage: 45, color: 'bg-red-500' },
        { name: 'Alimentação', amount: '780,30', percentage: 35, color: 'bg-blue-500' },
        { name: 'Transporte', amount: '450,00', percentage: 20, color: 'bg-purple-500' },
        { name: 'Lazer', amount: '239,20', percentage: 10, color: 'bg-yellow-400' },
    ],
    detailedTransactions: [
        { id: 1, description: 'Salário', date: '05 Jul, 2025', amount: '+ 5.000,00', type: 'income', icon: <DollarSign className="text-green-600" /> },
        { id: 2, description: 'Aluguel', date: '06 Jul, 2025', amount: '- 739,20', type: 'expense', icon: <Home className="text-red-600" /> },
        { id: 3, description: 'Supermercado', date: '08 Jul, 2025', amount: '- 350,70', type: 'expense', icon: <ShoppingCart className="text-blue-600" /> },
    ]
};
const accountsData = {
    totalBalance: '12.830,75',
    accounts: [
        { id: 1, name: 'Nubank', type: 'Conta Corrente', balance: '7.580,50', icon: <Landmark className="text-white" />, bgColor: 'bg-purple-600', isCard: false },
        { id: 2, name: 'Banco do Brasil', type: 'Conta Poupança', balance: '5.250,25', icon: <Landmark className="text-white" />, bgColor: 'bg-yellow-400', isCard: false },
        { id: 3, name: 'Cartão Inter', type: 'Fatura Atual', balance: '- 890,00', closingDay: 25, dueDate: 5, icon: <CreditCard className="text-white" />, bgColor: 'bg-blue-500', isCard: true }
    ]
};


const TransactionIcon = ({ icon, type }) => {
  const bgColor = type === 'income' ? 'bg-green-100' : 'bg-gray-100';
  return <div className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${bgColor}`}>{icon}</div>;
};

// --- COMPONENTES DE TELA ---

const DashboardScreen = ({ user, dashboardData }) => {
  if (!user || !dashboardData) {
    return <div className="p-6 text-center">A carregar dados...</div>;
  }
  
  const { dashboardSummary, dashboardTransactions } = dashboardData;

  return (
    <>
      <header className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Bem-vindo(a) de volta,</p>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          </div>
          <button className="text-gray-400 hover:text-gray-600"><Bell size={24} /></button>
        </div>
      </header>
      <main className="p-6 flex-grow overflow-y-auto pb-48">
        <div className="bg-indigo-600 text-white rounded-2xl p-6 mb-6 text-center shadow-lg">
          <p className="text-sm opacity-80">Saldo Consolidado</p>
          <p className="text-4xl font-bold mt-2">R$ {dashboardSummary.balance}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded-2xl flex items-center">
            <div className="bg-green-200 p-2 rounded-full mr-3"><ArrowUp size={16} /></div>
            <div><p className="text-sm">Receitas</p><p className="font-bold text-lg">R$ {dashboardSummary.income}</p></div>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded-2xl flex items-center">
            <div className="bg-red-200 p-2 rounded-full mr-3"><ArrowDown size={16} /></div>
            <div><p className="text-sm">Despesas</p><p className="font-bold text-lg">R$ {dashboardSummary.expenses}</p></div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Resumo do Mês</h2>
          <div className="bg-gray-100 p-4 rounded-2xl h-48 flex items-center justify-center">
            <div className="text-center text-gray-400"><PieChart size={48} className="mx-auto mb-2" /><p>[Espaço para o gráfico]</p></div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Últimos Lançamentos</h2>
          <div className="space-y-4">
            {dashboardTransactions && dashboardTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <TransactionIcon icon={<ShoppingCart className="text-blue-600" />} type={tx.type} />
                  <div><p className="font-semibold">{tx.description}</p><p className="text-sm text-gray-500">{tx.category}</p></div>
                </div>
                <div className="flex items-center">
                  <p className={`font-bold mr-3 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</p>
                  {tx.method === 'credit' && <CreditCard size={16} className="text-gray-400" title="Cartão de Crédito" />}
                  {tx.method === 'debit' && <Landmark size={16} className="text-green-500" title="Débito" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

const ReportsScreen = () => {
    return (
        <>
            <header className="p-6 bg-white border-b border-gray-200 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Relatórios</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-6 pb-24">
                <div className="mb-6">
                    <div className="flex space-x-2">
                        <button className="flex-1 text-sm bg-indigo-600 text-white py-2 px-4 rounded-full font-semibold">Este Mês</button>
                        <button className="flex-1 text-sm bg-gray-200 text-gray-700 py-2 px-4 rounded-full font-semibold">Mês Passado</button>
                        <button className="flex-1 text-sm bg-gray-200 text-gray-700 py-2 px-4 rounded-full font-semibold">90 Dias</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-100 text-green-800 p-4 rounded-2xl"><p className="text-sm">Total Receitas</p><p className="font-bold text-lg">R$ {reportsData.totalIncome}</p></div>
                    <div className="bg-red-100 text-red-800 p-4 rounded-2xl"><p className="text-sm">Total Despesas</p><p className="font-bold text-lg">R$ {reportsData.totalExpenses}</p></div>
                </div>
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Gastos por Categoria</h2>
                    <div className="space-y-4">
                        {reportsData.spendingByCategory.map(cat => (
                            <div key={cat.name}>
                                <div className="flex justify-between mb-1"><span className="text-base font-medium text-gray-700">{cat.name}</span><span className="text-sm font-medium text-gray-700">R$ {cat.amount}</span></div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`${cat.color} h-2.5 rounded-full`} style={{ width: `${cat.percentage}%` }}></div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Extrato Detalhado</h2>
                    <div className="space-y-2">
                        {reportsData.detailedTransactions.map(tx => (
                             <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center"><TransactionIcon icon={tx.icon} type={tx.type} /><div><p className="font-semibold">{tx.description}</p><p className="text-sm text-gray-500">{tx.date}</p></div></div>
                                <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};
const AccountsScreen = () => {
    return (
        <>
            <header className="p-6 bg-white border-b border-gray-200 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Minhas Contas</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-6 pb-24">
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl p-6 mb-8 text-center">
                    <p className="text-sm font-medium">Saldo Total em Contas</p>
                    <p className="text-3xl font-bold mt-2">R$ {accountsData.totalBalance}</p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Contas Conectadas</h2>
                    {accountsData.accounts.map(acc => (
                        <div key={acc.id} className="p-4 bg-gray-100 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 flex items-center justify-center ${acc.bgColor} rounded-full mr-4`}>{acc.icon}</div>
                                    <div><p className="font-semibold text-gray-900">{acc.name}</p><p className="text-sm text-gray-500">{acc.type}</p></div>
                                </div>
                                <p className={`font-bold text-lg ${acc.isCard ? 'text-red-600' : 'text-gray-800'}`}>{acc.balance}</p>
                            </div>
                            {acc.isCard && (
                                <div className="border-t border-gray-200 mt-3 pt-3 text-xs text-gray-600 flex justify-end space-x-4">
                                    <span>Fecha dia: <span className="font-bold">{acc.closingDay}</span></span>
                                    <span>Vence dia: <span className="font-bold">{acc.dueDate}</span></span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors">
                        <Plus size={20} className="mr-2" /><span>Adicionar Nova Conta</span>
                    </button>
                </div>
            </main>
        </>
    );
};
const ProfileScreen = ({ user }) => {
    if (!user) return <div className="p-6 text-center">A carregar...</div>;

    const menuItems = {
        account: [ { label: 'Editar Perfil', icon: <Edit size={20} className="text-gray-500" /> }, { label: 'Gerir Categorias', icon: <Tag size={20} className="text-gray-500" /> }, ],
        settings: [ { label: 'Notificações', icon: <Bell size={20} className="text-gray-500" /> }, { label: 'Segurança', icon: <Shield size={20} className="text-gray-500" /> }, { label: 'Ajuda e Suporte', icon: <HelpCircle size={20} className="text-gray-500" /> }, ]
    };

    return (
        <>
            <header className="p-6 bg-white border-b border-gray-200 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Perfil</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-6 pb-24">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4"><User size={48} className="text-gray-500" /></div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase px-2 mb-2">Conta</h3>
                        <div className="space-y-2">
                            {menuItems.account.map(item => (
                                <a key={item.label} href="#" className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                    <div className="flex items-center"><div className="w-8">{item.icon}</div><span>{item.label}</span></div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase px-2 mb-2">Definições</h3>
                        <div className="space-y-2">
                            {menuItems.settings.map(item => (
                                <a key={item.label} href="#" className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                    <div className="flex items-center"><div className="w-8">{item.icon}</div><span>{item.label}</span></div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <button className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                        <LogOut size={20} className="mr-2" /><span>Terminar Sessão</span>
                    </button>
                </div>
            </main>
        </>
    );
};

// --- COMPONENTES DE NAVEGAÇÃO E AÇÃO ---
const BottomNav = ({ activeScreen, setActiveScreen }) => {
    const navItems = [ { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> }, { id: 'reports', label: 'Relatórios', icon: <PieChart size={24} /> }, { id: 'accounts', label: 'Contas', icon: <Wallet size={24} /> }, { id: 'profile', label: 'Perfil', icon: <User size={24} /> }, ];
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-20">
            <div className="container mx-auto max-w-lg">
                <div className="flex justify-around items-center h-20">
                    {navItems.map(item => ( 
                        <button key={item.id} onClick={() => setActiveScreen(item.id)} className={`flex flex-col items-center justify-center transition-colors w-full h-full ${activeScreen === item.id ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-indigo-600'}`}>
                            {item.icon}
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
const SmartInputBar = () => {
    return (
        <div className="fixed bottom-20 left-0 right-0 z-10 bg-white/0 py-2">
            <div className="container mx-auto max-w-lg px-4">
                <div className="relative flex items-center">
                    <input type="text" placeholder="Ex: Gastei 50 no mercado no crédito" className="w-full p-4 pr-14 text-base bg-white border-2 border-gray-200 rounded-full shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    <button className="absolute right-2 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><Mic size={20} /></button>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para autenticar o utilizador
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Erro na autenticação:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Efeito para buscar os dados do utilizador após a autenticação
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setIsLoading(true);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const userDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setCurrentUser(prev => ({ ...prev, ...userDoc.data() }));
          const dashboardDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'dashboard', 'summary');
          const dashboardDoc = await getDoc(dashboardDocRef);
          if (dashboardDoc.exists()) {
            setDashboardData(dashboardDoc.data());
          }
        } else {
          const initialUserData = { name: 'Novo Utilizador', email: currentUser.email || 'email@exemplo.com' };
          const initialDashboardData = {
            dashboardSummary: { balance: '0,00', income: '0,00', expenses: '0,00' },
            dashboardTransactions: [{ id: 1, description: 'Sua primeira transação aparecerá aqui!', category: 'Dica', amount: '', type: 'info', method: 'none' }]
          };
          await setDoc(userDocRef, initialUserData);
          await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'dashboard', 'summary'), initialDashboardData);
          setCurrentUser(prev => ({ ...prev, ...initialUserData }));
          setDashboardData(initialDashboardData);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [currentUser?.uid]);

  const renderScreen = () => {
    if (isLoading) {
        return <div className="p-6 text-center flex-grow flex items-center justify-center">A carregar aplicação...</div>;
    }
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen user={currentUser} dashboardData={dashboardData} />;
      case 'reports':
        return <ReportsScreen />;
      case 'accounts':
        return <AccountsScreen />;
      case 'profile':
        return <ProfileScreen user={currentUser} />;
      default:
        return <DashboardScreen user={currentUser} dashboardData={dashboardData} />;
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <div className="container mx-auto max-w-lg min-h-screen bg-white shadow-lg flex flex-col relative">
        {renderScreen()}
        {activeScreen === 'dashboard' && <SmartInputBar />}
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
    </div>
  );
}
