const aaa = {
  total: 'int',
  pageSize: 'int', // số items trong 1 trang, mặc định 20 items, tối đa 100 items
  data: [
    {
      id: 'long', //Id nhập hàng
      code: 'string', //Mã đặt hàng
      invoiceId: 'long', //Id nhập hàng - optional
      orderDate: 'datetime', // Ngày đặt
      branchId: 'int', //Id chi nhánh
      retailerId: 'int', //Id cửa hàng
      userId: 'long', //Id người dùng
      description: 'string', // Ghi chú
      status: 'int', // Trạng thái
      discountRatio: 'string', // Giảm giá theo %
      productQty: 'double', // Số lương- optional
      discount: 'decimal', // Giảm giá - optional
      createdDate: 'datetime', // Ngày tạo
      createdBy: 'long', // Id người tạo
      totalTax: 'decimal', // Tổng thuế - optional
      orderSupplierDetails: [
        {
          id: 'long',
          orderSupplierId: 'long',
          productId: 'long',
          quantity: 'double',
          price: 'decimal',
          discount: 'decimal',
          allocation: 'decimal',
          createdDate: 'datime',
          description: 'string',
          orderByNumber: 'int', // optional
          allocationSuppliers: 'decimal', // optional
          allocationThirdParty: 'decimal', // optional
          orderQuantity: 'double',
          subTotal: 'decimal',
          orderSupplierDetailTaxes: [
            {
              id: 'int',
              detailId: 'long', // ID chi tiết đặt hàng
              taxId: 'int', // ID thuế
              detailTax: 'decimal', // Giá trị thuế chi tiết - optional
            },
          ],
        },
      ],

      OrderSupplierExpensesOthers: [
        {
          id: 'long',
          form: 'int', // optional
          expensesOtherOrder: 'byte', // optional
          expensesOtherCode: 'string',
          expensesOtherName: 'string',
          expensesOtherId: 'int',
          orderSupplierId: 'long', // optional
          price: 'decimal',
          isReturnAuto: 'bool', // optional
          exValue: 'decimal', // optional
          createdDate: 'datetime',
        },
      ],
      total: 'decimal',
      exReturnSuppliers: 'decimal', // optional
      exReturnThirdParty: 'decimal', // optional
      totalAmt: 'decimal', // optional
      totalQty: 'double', // optional
      totalQuantity: 'double',
      subTotal: 'decimal',
      paidAmount: 'decimal',
      toComplete: 'bool',
      statusValue: 'string',
      viewPrice: 'bool',
      supplierDebt: 'decimal',
      supplierOldDebt: 'decimal',
      purchaseOrderCodes: 'string',
      supplierId: 'int', //ID nhà cung cấp - optional
      supplierCode: 'string', //Mã nhã cung cấp do người dùng tạo
      supplierName: 'string', //Tên nhà cung cấp
    },
  ],
};
