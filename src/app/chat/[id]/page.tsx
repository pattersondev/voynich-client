import ChatRoom from "@/components/ChatRoom";

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatRoom id={params.id} />;
}
