import { useState, useEffect } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { paymentService, contractService } from '../../services';
import { Button, Input, Select, SearchableSelect, Modal } from '../../components/ui';
import type { Payment, Contract } from '../../types';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PAYMENT_TYPE_OPTIONS = [
  { value: 'Pago Inicial', label: 'Pago Inicial' },
  { value: 'Cuota', label: 'Cuota' },
  { value: 'Abono', label: 'Abono' },
];

const PAYMENT_METHODS = [
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Transferencia', label: 'Transferencia' },
  { value: 'Yape', label: 'Yape' },
  { value: 'Plin', label: 'Plin' },
  { value: 'Tarjeta', label: 'Tarjeta' },
  { value: 'Otro', label: 'Otro' },
];

export function PaymentRegister() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadPayments();
  }, [page]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getAll({ page, limit: 15 });
      setPayments(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setPayments([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = async () => {
    try {
      const response = await contractService.getAll({ limit: 100, estado: 'Vigente' });
      setContracts(response.items);
      setSelectedContractId('');
      reset({
        fechaPago: new Date().toISOString().split('T')[0],
        medioPago: 'Efectivo',
        tipo: 'Cuota',
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error al cargar contratos');
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedContractId) {
      toast.error('Seleccione un contrato');
      return;
    }
    try {
      await paymentService.create({
        contractId: parseInt(selectedContractId),
        tipo: data.tipo,
        importe: parseFloat(data.importe),
        fechaPago: data.fechaPago,
        medioPago: data.medioPago,
        numeroOperacion: data.numeroOperacion,
        notas: data.notas,
      });
      toast.success('Pago registrado');
      setIsModalOpen(false);
      loadPayments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar pago');
    }
  };

  // Calculate daily totals
  const todayTotal = payments
    .filter(p => p.fechaPago === new Date().toISOString().split('T')[0])
    .reduce((sum, p) => sum + parseFloat(p.importe.toString()), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Caja - Pagos</h1>
          <p className="text-slate-400">Registro de pagos del sistema</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Pago
        </Button>
      </div>

      {/* Summary */}
      <div className="glass rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Total Hoy</p>
          <p className="text-3xl font-bold text-green-400">S/ {todayTotal.toFixed(2)}</p>
        </div>
        <DollarSign className="w-12 h-12 text-green-400/30" />
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Fecha</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Contrato</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Tipo</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Importe</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Medio</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">N° Op.</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                  Cargando...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                  No hay pagos registrados
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="px-6 py-4 text-slate-300">
                    {format(new Date(payment.fechaPago), 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 text-white">#{payment.contractId}</td>
                  <td className="px-6 py-4 text-slate-300">{payment.tipo}</td>
                  <td className="px-6 py-4 text-green-400 font-medium">
                    S/ {parseFloat(payment.importe.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{payment.medioPago}</td>
                  <td className="px-6 py-4 text-slate-400">{payment.numeroOperacion || '-'}</td>
                  <td className="px-6 py-4 text-slate-400">{payment.usuarioNombre}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-slate-400">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Create Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Pago"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SearchableSelect
            label="Contrato"
            placeholder="Buscar por número o placa..."
            options={contracts.map(c => ({
              value: c.id.toString(),
              label: `#${c.id} - ${c.vehicle?.placa || 'N/A'} (${c.clienteNombre || 'Sin cliente'})`,
              searchText: `${c.id} ${c.vehicle?.placa} ${c.clienteNombre} ${c.clienteDni}`,
            }))}
            value={selectedContractId}
            onChange={setSelectedContractId}
            error={!selectedContractId && errors.contractId ? 'Seleccione un contrato' : undefined}
          />
          <Select
            label="Tipo de Pago"
            options={PAYMENT_TYPE_OPTIONS}
            {...register('tipo')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Pago"
              type="date"
              {...register('fechaPago')}
            />
            <Input
              label="Importe"
              type="number"
              step="0.01"
              placeholder="100.00"
              error={errors.importe?.message as string}
              {...register('importe', { required: 'Requerido' })}
            />
          </div>
          <Select
            label="Medio de Pago"
            options={PAYMENT_METHODS}
            {...register('medioPago')}
          />
          <Input
            label="N° Operación (opcional)"
            placeholder="000123456"
            {...register('numeroOperacion')}
          />
          <Input
            label="Notas (opcional)"
            placeholder="Notas adicionales..."
            {...register('notas')}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Pago
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
