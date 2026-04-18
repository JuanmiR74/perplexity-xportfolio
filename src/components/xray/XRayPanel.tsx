import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default function XRayPanel() { return (<div style={{ width: '100%', height: 300 }}><ResponsiveContainer><LineChart data={[]}><XAxis dataKey="name" /><YAxis /><CartesianGrid /><Tooltip /><Line type="monotone" dataKey="value" stroke="#8884d8" /></LineChart></ResponsiveContainer></div>); }
