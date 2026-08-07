import React, { useState, useEffect, use } from 'react';
import { Modal, Typography, Button, Divider, Tag, message } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { payTransaction, refundTransaction } from '../api/Transaction';
import type { TransactionItem } from '../types';

const { Title, Text } = Typography;


interface TransactionModalProps {
    transaction: TransactionItem | null;
    open: boolean;
    onClose: () => void;
    onPaymentSuccess: (transactionId: number) => void;
    onRefundSuccess: (transactionId: number) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
    transaction, 
    open, 
    onClose,
    onPaymentSuccess,
    onRefundSuccess 
}) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [isPaying, setIsPaying] = useState(false);
    const [isRefunding, setIsRefunding] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        
        if (open && transaction?.status === 'Pending') {
            const rawDate = transaction.purchaseDate; 
            const cleanDate = rawDate.replace(/\.(\d{3})\d+/, '.$1' + (rawDate.endsWith('Z') ? '' : 'Z'));
            const purchasedTime = new Date(cleanDate).getTime();
            console.log(purchasedTime);
            
            const expirationTime = purchasedTime + (15 * 1000); 
            
            const updateTimer = () => {
                const currentTime = Date.now();
                const difference = Math.floor((expirationTime - currentTime) / 1000);
                
                if (difference <= 0) {
                    setTimeLeft(0);
                    clearInterval(timer);
                } else {
                    setTimeLeft(difference);
                }
            };
            updateTimer(); 
            
            timer = setInterval(updateTimer, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [open, transaction]);

    const handlePay = async () => {
        if (!transaction) return;
        
        setIsPaying(true);
        try {
            
            await payTransaction(transaction.transactionId);
            
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success("Payment successful!");
            onPaymentSuccess(transaction.transactionId); 
            onClose(); 
        } catch (error) {
            message.error("Payment failed. Please try again.");
        } finally {
            setIsPaying(false);
        }
    };

    const handleRefundRequest = async () => {
        
        message.info("Refund request feature coming soon.");
        if (!transaction) return;

        setIsRefunding(true);
        try{
            await refundTransaction(transaction.transactionId);

            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success("Refund duccesful!");
            onRefundSuccess(transaction.transactionId);
            onClose();
        } catch (error) {
            message.error("Refund failed. Please try again.")
        } finally {
            setIsRefunding(false);
        }
    };

    if (!transaction) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={850}
            centered
            destroyOnClose
            
            bodyStyle={{ padding: 0, overflow: 'hidden', backgroundColor: '#1e1e24', borderRadius: '16px' }}
            style={{ padding: 0, backgroundColor: 'transparent', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)' }}
            closeIcon={<span className="text-white hover:text-[#d4af37] text-xl bg-black/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</span>}
        >
            <div className="flex flex-col md:flex-row min-h-[500px]">
                
                <div className="w-full md:w-1/3 h-[250px] md:h-auto relative bg-[#0f0f12]">
                    {transaction.poster ? (
                        <img 
                            src={transaction.poster} 
                            alt={transaction.movieTitle} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#64748b]">No Poster</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#1e1e24] opacity-90"></div>
                </div>

                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between font-sans text-white">
                    
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <Title level={3} className="!text-white !m-0 line-clamp-2 pr-4">
                                {transaction.movieTitle}
                            </Title>
                            
                            <Tag color={transaction.status === 'Completed' ? '#22c55e' : transaction.status === 'Pending' ? '#f97316' : '#64748b'} className="!m-0 text-sm px-3 py-1 border-none font-bold uppercase tracking-wider">
                                {transaction.status}
                            </Tag>
                        </div>

                        <Text className="text-[#94a3b8] text-xs font-bold">
                            Purchased on: {transaction.showDate.split("T"[0])}
                        </Text>

                        <Divider className="border-[rgba(212,175,55,0.15)] my-5" />

                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
                            <div>
                                <Text className="block text-[#64748b] text-xs uppercase tracking-wider mb-1">Cinema & Room</Text>
                                <Text className="block font-semibold text-sm">
                                    <EnvironmentOutlined className="text-[#d4af37] mr-1" /> {transaction.cinemaName}
                                </Text>
                                <Text className="block text-[#94a3b8] text-sm ml-5">{transaction.roomName}</Text>
                            </div>

                            <div>
                                <Text className="block text-[#64748b] text-xs uppercase tracking-wider mb-1">Date & Time</Text>
                                <Text className="block font-semibold text-sm">
                                    <CalendarOutlined className="text-[#d4af37] mr-1" /> {transaction.showDate}
                                </Text>
                                <Text className="block text-[#94a3b8] text-sm ml-5">
                                    {transaction.startTime} - {transaction.endTime}
                                </Text>
                            </div>
                        </div>

                        <div className="mb-6">
                            <Text className="block text-[#64748b] text-xs uppercase tracking-wider mb-2">Selected Seats ({transaction.purchasedSeats.length})</Text>
                            <div className="flex flex-wrap gap-2">
                                {transaction.purchasedSeats.map((seat, index) => (
                                    <span key={index} className="bg-[#0f0f12] border border-[rgba(212,175,55,0.3)] text-[#d4af37] px-3 py-1 rounded-md text-sm font-semibold shadow-sm">
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-6 border-t border-[rgba(212,175,55,0.15)] flex justify-between items-center bg-[#1e1e24]">
                        
                        <div>
                            <Text className="block text-[#64748b] text-xs uppercase tracking-wider">Total Amount</Text>
                            <Text className="block text-2xl font-bold text-[#d4af37]">${transaction.totalAmount.toFixed(2)}</Text>
                        </div>

                        <div className="flex items-center gap-4">
                            {transaction.status === 'Pending' && (
                                <>
                                    <Text className={`font-mono text-lg font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                        <ClockCircleOutlined className="mr-1" /> 00:{timeLeft.toString().padStart(2, '0')}
                                    </Text>
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        loading={isPaying}
                                        disabled={timeLeft === 0}
                                        onClick={handlePay}
                                        className="!bg-[#d4af37] hover:!bg-[#e6c24a] !text-black border-none font-bold tracking-wider px-8 h-12 shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                                    >
                                        {timeLeft === 0 ? 'EXPIRED' : 'PAY NOW'}
                                    </Button>
                                </>
                            )}

                            {transaction.status === 'Completed' && (
                                <Button 
                                    type="default" 
                                    size="large"
                                    loading={isRefunding}
                                    onClick={handleRefundRequest}
                                    className="!bg-transparent hover:!bg-[#9f1239] !text-[#9f1239] hover:!text-white border border-[#9f1239] hover:border-[#9f1239] font-bold tracking-wider px-6 h-12 transition-all duration-300"
                                >
                                    REQUEST REFUND
                                </Button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
};