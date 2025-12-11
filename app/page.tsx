import GalaxyViewer from './components/GalaxyViewer';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen">
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32 px-16 dark:bg-black sm:items-start bg-black">
        <div className="h-[600px] w-full">
          <GalaxyViewer />
        </div>
      </main>{' '}
    </div>
  );
}
