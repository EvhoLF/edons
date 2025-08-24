'use client'
import useSocketStats from '@/hooks/coop/useSockerStats'
import React from 'react'
import InputButton from '../UI/MUI/InputButton';

const Stats = () => {
  const { requestSocketStats, socketStats } = useSocketStats();

  const { rooms, users, memoryMB, uptimeSec, } = socketStats

  return (
    <div>
      <div>
        <div>rooms: {socketStats.rooms}</div>
        <div>users: {socketStats.users}</div>
        <div>memoryMB: {socketStats.memoryMB}</div>
        <div>uptimeSec: {socketStats.uptimeSec}</div>
      </div>
      <InputButton variant='contained' fullWidth onClick={requestSocketStats}>zxc</InputButton>
    </div>
  )
}

export default Stats