export default function TelegramLoader({ loading, error }: { loading?: boolean; error?: string | null }) {
      if (loading) return <div style={{color:'white',textAlign:'center',marginTop:'50%'}}>جاري التحميل...</div>;
        return null;
}
