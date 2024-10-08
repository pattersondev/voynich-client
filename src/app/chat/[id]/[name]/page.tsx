import ChatRoom from "@/components/ChatRoom";

export default function ChatPage({
  params,
}: {
  params: { id: string; name: string };
}) {
  return <ChatRoom id={params.id} name={params.name} />;
}
