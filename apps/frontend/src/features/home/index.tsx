import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { Games } from '@/const/games';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyBetsTable from '../my-bets/my-bets-table';
import AllBetsTable from '../all-bets/all-bets-table';

enum TabsEnum {
  MyBets = 'myBets',
  AllBets = 'allBets',
}

function Home(): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.MyBets);
  return (
    <div className="container py-8 flex flex-col gap-8">
      <InputWithIcon
        className="placeholder:text-xs"
        icon={null}
        leftIcon={<SearchIcon className="ml-2 text-[#557086]" />}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchText(e.target.value);
        }}
        placeholder="Search your game"
      />

      <div className="flex gap-4 w-full flex-wrap">
        {Object.values(Games)
          .filter(game => game.toLowerCase().includes(searchText.toLowerCase()))
          .map(game => (
            <Link
              key={game}
              params={{ gameId: game }}
              to="/casino/games/$gameId"
            >
              <img
                alt={game}
                className="h-40 aspect-[3/4] rounded hover:-translate-y-2 transition-smooth"
                src={`/games/illustration/${game}.png`}
              />
            </Link>
          ))}
      </div>
      <Tabs
        defaultValue={TabsEnum.MyBets}
        onValueChange={value => {
          setActiveTab(value as TabsEnum);
        }}
      >
        <TabsList className="grid w-52 grid-cols-2 h-[44px]">
          <TabsTrigger value={TabsEnum.MyBets}>My Bets</TabsTrigger>
          <TabsTrigger value={TabsEnum.AllBets}>All Bets</TabsTrigger>
        </TabsList>

        <TabsContent value={TabsEnum.MyBets}>
          <MyBetsTable />
        </TabsContent>
        <TabsContent value={TabsEnum.AllBets}>
          <AllBetsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Home;
