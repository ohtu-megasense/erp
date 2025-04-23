import { useState, useRef, useEffect } from "react";
import {
	Box,
	Button,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface Message {
	role: "user" | "assistant";
	content: string;
}

export const AiErpPage = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const newMessages: Message[] = [
			...messages,
			{ role: "user" as const, content: input },
		];
		setMessages(newMessages);
		setInput("");
		setLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ messages: newMessages }),
			});

			const data = await response.json();
			if (data.reply) {
				setMessages([
					...newMessages,
					{ role: "assistant", content: data.reply },
				]);
			}
		} catch (error) {
			console.error("Chat request failed:", error);
			setMessages([
				...newMessages,
				{ role: "assistant", content: "Error: Could not get response." },
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack spacing={2} p={2}>
			<Typography variant="h4" fontWeight={600} color="primary">
				AI ERP Chat
			</Typography>

			<Paper
				elevation={3}
				sx={{
					p: 2,
					height: 400,
					overflowY: "auto",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{messages.map((msg, idx) => (
					<Box
						key={idx}
						sx={{
							alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
							bgcolor: msg.role === "user" ? "#e0f7fa" : "#f1f8e9",
							color: "black",
							p: 1.5,
							borderRadius: 2,
							my: 0.5,
							maxWidth: "75%",
						}}
					>
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={{
								strong: ({ ...props }) => (
									<Typography variant="body1" sx={{ fontWeight: "bold" }}>
										{props.children}
									</Typography>
								),
								em: ({ ...props }) => (
									<Typography variant="body1" sx={{ fontStyle: "italic" }}>
										{props.children}
									</Typography>
								),
							}}
						>
							{msg.content}
						</ReactMarkdown>
					</Box>
				))}
				<div ref={messagesEndRef} />
			</Paper>

			<Stack direction="row" spacing={1}>
				<TextField
					fullWidth
					variant="outlined"
					placeholder="Type your message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSend();
					}}
					disabled={loading}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSend}
					disabled={loading}
				>
					Send
				</Button>
			</Stack>
		</Stack>
	);
};
