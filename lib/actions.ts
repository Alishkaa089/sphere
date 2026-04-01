'use server'

import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: { isSold: false },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return properties
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export async function getUserProperties(email: string) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        // @ts-ignore
        user: { email }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return properties
  } catch (error) {
    console.error('Error fetching user properties:', error)
    return []
  }
}

export async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isSold: false },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return vehicles
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
}

export async function getUserVehicles(email: string) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        // @ts-ignore
        user: { email }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return vehicles
  } catch (error) {
    console.error('Error fetching user vehicles:', error)
    return []
  }
}

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: id as any }
    })
    return property
  } catch (error) {
    console.error('Error fetching property by id:', error)
    return null
  }
}

export async function getVehicleById(id: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: id as any }
    })
    return vehicle
  } catch (error) {
    console.error('Error fetching vehicle by id:', error)
    return null
  }
}

export async function registerUser(data: any) {
  try {
    const { password, name } = data;
    const email = data.email.toLowerCase().trim();
    
    // Check if user exists
    const existingUser = await (prisma as any).user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return { error: 'Bu e-poçt ünvanı artıq qeydiyyatdan keçib.' };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await (prisma as any).user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=004E64&color=fff`,
        role: email === "adminyekdi@gmail.com" ? "admin" : "seller",
        plan: "BASIC"
      }
    });
    
    return { 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role, 
        plan: user.plan, 
        avatar: user.avatar 
      } 
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Qeydiyyat zamanı xəta baş verdi.' };
  }
}

export async function checkSocialUser(email: string) {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;
    const user = await userModel.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (user) {
      return {
        exists: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          avatar: user.avatar
        }
      };
    }
    return { exists: false };
  } catch (error) {
    return { error: "Xəta baş verdi" };
  }
}

export async function socialLogin(userData: { email: string; name: string; avatar?: string }) {
  try {
    const email = userData.email.toLowerCase().trim();
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;

    let user = await userModel.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user if not exists
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await userModel.create({
        data: {
          email,
          name: userData.name,
          password: hashedPassword,
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=004E64&color=fff`,
          role: email === "adminyekdi@gmail.com" ? "admin" : "user",
          plan: "BASIC"
        }
      });
    } else {
      // If user exists, update their name if it was empty (shouldn't happen with the new flow)
      if (!user.name && userData.name) {
        user = await userModel.update({
          where: { id: user.id },
          data: { name: userData.name }
        });
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar
      }
    };
  } catch (error) {
    console.error('Social login error:', error);
    return { error: 'Giriş zamanı xəta baş verdi.' };
  }
}

export async function loginUser(data: any) {
  try {
    const email = data.email.toLowerCase().trim();
    const { password } = data;

    // Special Master Login for Admin
    if (email === "adminyekdi@gmail.com" && password === "AdminYekdi123") {
      let user = await (prisma as any).user.findUnique({
        where: { email }
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await (prisma as any).user.create({
          data: {
            email,
            password: hashedPassword,
            name: "Admin Yekdi",
            role: "admin",
            avatar: `https://ui-avatars.com/api/?name=Admin+Yekdi&background=004E64&color=fff`
          }
        });
      } else if (user.role !== "admin") {
        user = await (prisma as any).user.update({
          where: { email },
          data: { role: "admin" }
        });
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          avatar: user.avatar
        }
      };
    }
    
    let user = await (prisma as any).user.findUnique({
      where: { email }
    });
    
    // Auto-downgrade check
    if (user && user.plan === "PRO" && user.planExpiresAt) {
      if (new Date() > new Date(user.planExpiresAt)) {
        user = await (prisma as any).user.update({
          where: { id: user.id },
          data: { plan: "BASIC", planStartDate: null, planExpiresAt: null }
        });
      }
    }
    
    if (!user) {
      return { error: 'E-poçt və ya şifrə yanlışdır.' };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { error: 'E-poçt və ya şifrə yanlışdır.' };
    }
    
    return { 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role, 
        plan: user.plan,
        avatar: user.avatar 
      } 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Giriş zamanı xəta baş verdi.' };
  }
}

export async function createProperty(data: any, userEmail: string) {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;
    const propModel = p.property || p.Property || p.properties;

    if (!userModel || !propModel) {
      return { error: 'Sistem xətası: Modullar tapılmadı.' };
    }

    const user = await userModel.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return { error: 'İstifadəçi tapılmadı.' };
    }

    // CHECK LIMIT
    const [propCount, vehCount] = await Promise.all([
      propModel.count({ where: { userId: user.id } }),
      (p.vehicle || p.Vehicle).count({ where: { userId: user.id } })
    ]);

    const totalAds = propCount + vehCount;
    const limit = user.plan === "BASIC" ? 5 : user.plan === "PRO" ? 50 : 100000;

    if (totalAds >= limit) {
      return { error: 'PLAN_LIMIT_REACHED', limit, current: totalAds, plan: user.plan };
    }

    const property = await (prisma as any).property.create({
      data: {
        title: data.title,
        category: data.category,
        status: data.status,
        city: data.city,
        country: data.country,
        price: parseInt(data.price),
        beds: parseInt(data.beds || 0),
        baths: parseInt(data.baths || 0),
        area: parseInt(data.area || 0),
        rating: 5.0,
        img: data.img || "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
        userId: user.id
      }
    });

    return { success: true, property };
  } catch (error) {
    console.error('Create property error:', error);
    return { success: false, error: 'Mülk yaradılarkən xəta baş verdi.' };
  }
}

export async function createVehicle(data: any, userEmail: string) {
  try {
    const user = await (prisma as any).user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return { error: 'İstifadəçi tapılmadı.' };
    }

    // CHECK LIMIT
    const [propCount, vehCount] = await Promise.all([
      (prisma as any).property.count({ where: { userId: user.id } }),
      (prisma as any).vehicle.count({ where: { userId: user.id } })
    ]);

    const totalAds = propCount + vehCount;
    const limit = user.plan === "BASIC" ? 5 : user.plan === "PRO" ? 50 : 1000;

    if (totalAds >= limit) {
      return { error: 'PLAN_LIMIT_REACHED', limit, current: totalAds, plan: user.plan };
    }

    const vehicle = await (prisma as any).vehicle.create({
      data: {
        title: data.title,
        category: data.category,
        status: data.status,
        country: data.country,
        city: data.city,
        price: parseInt(data.price),
        battery: data.battery ? parseInt(data.battery) : null,
        range: data.range ? parseInt(data.range) : null,
        power: data.power || "",
        rating: 5.0,
        img: data.img || "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        userId: user.id
      }
    });

    return { success: true, vehicle };
  } catch (error) {
    console.error('Create vehicle error:', error);
    return { error: 'Avtomobil yaradılarkən xəta baş verdi.' };
  }
}

export async function createOrder(data: any, userEmail: string) {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;
    const orderModel = p.order || p.Order || p.orders;

    if (!userModel || !orderModel) {
      return { error: 'Sistem xətası: Modullar tapılmadı.' };
    }

    const user = await userModel.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return { error: 'İstifadəçi tapılmadı.' };
    }

    const order = await orderModel.create({
      data: {
        productId: data.productId,
        title: data.title,
        type: data.type,
        totalPrice: parseInt(data.totalPrice),
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        userId: user.id
      }
    });

    // If it's a SALE, mark the product as SOLD
    if (data.type === "Satınalma" && data.productId) {
      const isProp = await p.property.findUnique({ where: { id: data.productId } });
      if (isProp) {
        await p.property.update({ where: { id: data.productId }, data: { isSold: true } });
      } else {
        const isVeh = await p.vehicle.findUnique({ where: { id: data.productId } });
        if (isVeh) {
          await p.vehicle.update({ where: { id: data.productId }, data: { isSold: true } });
        }
      }
    }

    return { success: true, order };
  } catch (error) {
    console.error('Create order error:', error);
    return { error: 'Sifariş yaradılarkən xəta baş verdi.' };
  }
}

export async function getReservedDates(productId: string) {
  try {
    const orders = await (prisma as any).order.findMany({
      where: {
        productId,
        type: "İcarə",
        endDate: { gte: new Date() }
      },
      select: { startDate: true, endDate: true }
    });
    return { success: true, reservedDates: orders };
  } catch (error) {
    return { success: false, reservedDates: [] };
  }
}

export async function getAdminStats() {
  try {
    const p = prisma as any;
    // Defensive model access
    const userModel = p.user || p.User || p.users;
    const propModel = p.property || p.Property || p.properties;
    const transModel = p.vehicle || p.Vehicle || p.vehicles || p.transport;
    const orderModel = p.order || p.Order || p.orders;

    if (!orderModel) {
        console.warn("Order model not found in Prisma client!");
    }

    const [totalUsersCount, propertiesCount, vehiclesCount, orders] = await Promise.all([
      userModel ? userModel.count() : Promise.resolve(0),
      propModel ? propModel.count() : Promise.resolve(0),
      transModel ? transModel.count() : Promise.resolve(0),
      orderModel ? orderModel.findMany({ orderBy: { createdAt: 'desc' } }) : Promise.resolve([])
    ]);

    const realRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
    
    return {
      success: true,
      stats: {
        totalUsers: totalUsersCount,
        totalRevenue: realRevenue,
        totalProps: propertiesCount,
        totalTrans: vehiclesCount,
        recentOrders: orders.slice(0, 5)
      }
    };
  } catch (error) {
    console.error('Fetch stats error:', error);
    return { success: false, error: 'Statistika yüklənərkən xəta baş verdi.' };
  }
}

export async function getAllUsers() {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;

    if (!userModel) {
      console.error("Prisma Client: User model not found!");
      return { success: false, error: "İstifadəçi modeli tapılmadı." };
    }

    try {
      // Primary: ORM select
      const users = await userModel.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          planStartDate: true,
          planExpiresAt: true,
          sellerRequestStatus: true,
          jobTitle: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, users };
    } catch (ormError: any) {
      // Fallback: Raw SQL if fields are "unknown" to the client index
      if (ormError.message?.includes('Unknown field')) {
        const rawUsers = await p.$queryRawUnsafe(`
          SELECT id, email, name, role, plan, planStartDate, planExpiresAt, sellerRequestStatus, jobTitle, createdAt 
          FROM User 
          ORDER BY createdAt DESC
        `);
        return { success: true, users: rawUsers };
      }
      throw ormError;
    }
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return { success: false, error: "İstifadəçilər yüklənərkən xəta baş verdi." };
  }
}

export async function getAllPropertiesAdmin() {
  try {
    const properties = await (prisma as any).property.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, properties };
  } catch (error) {
    console.error('Error in getAllPropertiesAdmin:', error);
    return { success: false, error: 'Mülklər yüklənərkən xəta baş verdi.' };
  }
}

export async function getAllVehiclesAdmin() {
  try {
    const vehicles = await (prisma as any).vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, vehicles };
  } catch (error) {
    console.error('Error in getAllVehiclesAdmin:', error);
    return { success: false, error: 'Avtomobillər yüklənərkən xəta baş verdi.' };
  }
}

export async function getAllOrdersAdmin() {
  try {
    const p = prisma as any;
    const orderModel = p.order || p.Order || p.orders;
    
    if (!orderModel) {
        return { success: true, orders: [] }; // Fallback
    }

    const orders = await orderModel.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error in getAllOrdersAdmin:', error);
    return { success: false, error: 'Sifarişlər yüklənərkən xəta baş verdi.' };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const user = await (prisma as any).user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    return { success: true, user };
  } catch (error) {
    console.error('Update user role error:', error);
    return { success: false, error: 'İstifadəçi rolu yenilənərkən xəta baş verdi.' };
  }
}

export async function upgradeUserPlan(userEmail: string, newPlan: string) {
  try {
    const p = prisma as any;
    
    let updateData: any = { plan: newPlan };
    if (newPlan === "PRO") {
      const now = new Date();
      const expires = new Date();
      expires.setDate(now.getDate() + 30);
      updateData.planStartDate = now;
      updateData.planExpiresAt = expires;
    } else {
      updateData.planStartDate = null;
      updateData.planExpiresAt = null;
    }

    try {
      const user = await p.user.update({
        where: { email: userEmail },
        data: updateData
      });
      return { success: true, user };
    } catch (ormError: any) {
      if (ormError.message?.includes('Unknown argument')) {
        if (newPlan === "PRO") {
           const now = new Date().toISOString();
           const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
           await p.$executeRawUnsafe(
             `UPDATE User SET plan = ?, planStartDate = ?, planExpiresAt = ? WHERE email = ?`,
             newPlan, now, expires, userEmail
           );
        } else {
           await p.$executeRawUnsafe(
             `UPDATE User SET plan = ?, planStartDate = NULL, planExpiresAt = NULL WHERE email = ?`,
             newPlan, userEmail
           );
        }
        const user = await p.user.findUnique({ where: { email: userEmail } });
        return { success: true, user };
      }
      throw ormError;
    }
  } catch (error) {
    console.error('Upgrade plan error:', error);
    return { success: false, error: 'Plan yenilənərkən xəta baş verdi.' };
  }
}

export async function getUserPlan(userEmail: string) {
  try {
    const p = prisma as any;
    const user = await p.user.findUnique({
      where: { email: userEmail }
    });
    if (!user) return "BASIC";

    // CHECK EXPIRATION
    if (user.plan === "PRO" && user.planExpiresAt) {
      if (new Date() > new Date(user.planExpiresAt)) {
        // AUTO DOWNGRADE
        await p.user.update({
          where: { id: user.id },
          data: { plan: "BASIC", planStartDate: null, planExpiresAt: null }
        });
        return "BASIC";
      }
    }

    return user.plan || "BASIC";
  } catch (error) {
    return "BASIC";
  }
}
export async function submitEliteContact(data: any, userEmail: string) {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;
    const reqModel = p.elitePartnerRequest || p.ElitePartnerRequest;

    if (!userModel) {
      return { success: false, error: 'Sistem xətası: Modullar tapılmadı.' };
    }

    const user = await userModel.findUnique({ where: { email: userEmail } });
    if (!user) return { success: false, error: 'İstifadəçi tapılmadı. Zəhmət olmasa daxil olun.' };

    if (!reqModel) {
      const { randomUUID } = require('crypto');
      const id = randomUUID();
      const now = new Date().toISOString();
      await p.$executeRawUnsafe(
        `INSERT INTO ElitePartnerRequest (id, userId, company, position, phone, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)`,
        id, user.id, data.company || "", data.type || "other", data.phone || "", data.message || "", now, now
      );
      return { success: true };
    }

    const req = await reqModel.create({
      data: {
        userId: user.id,
        company: data.company,
        position: data.type || "other",
        phone: data.phone || "",
        message: data.message
      }
    });

    return { success: true, req };
  } catch (error) {
    console.error('Submit elite contact error:', error);
    return { success: false, error: 'Müraciətiniz göndərilərkən xəta baş verdi.' };
  }
}

export async function getEliteRequests() {
  try {
    const p = prisma as any;
    const reqModel = p.elitePartnerRequest || p.ElitePartnerRequest;
    
    if (!reqModel) {
      const rawReqs = await p.$queryRawUnsafe(`
        SELECT e.*, u.name as userName, u.email as userEmail
        FROM ElitePartnerRequest e
        LEFT JOIN User u ON e.userId = u.id
        ORDER BY e.createdAt DESC
      `);
      const formatted = rawReqs.map((r: any) => ({
         ...r,
         user: { name: r.userName, email: r.userEmail }
      }));
      return { success: true, requests: formatted };
    }

    const requests = await reqModel.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    return { success: true, requests };
  } catch (error) {
    console.error('Get elite requests error:', error);
    return { success: false, error: 'Müraciətlər yüklənərkən xəta baş verdi.' };
  }
}

export async function updateEliteRequestStatus(requestId: string, action: "APPROVED" | "REJECTED", adminNotes?: string) {
  try {
    const p = prisma as any;
    const reqModel = p.elitePartnerRequest || p.ElitePartnerRequest;
    const userModel = p.user || p.User || p.users;

    let userId = null;

    if (!reqModel) {
      await p.$executeRawUnsafe(
        `UPDATE ElitePartnerRequest SET status = ?, adminNotes = ? WHERE id = ?`,
        action, adminNotes || null, requestId
      );
      const rows: any[] = await p.$queryRawUnsafe(`SELECT userId FROM ElitePartnerRequest WHERE id = ?`, requestId);
      if (rows && rows.length > 0) userId = rows[0].userId;
    } else {
      const req = await reqModel.update({
        where: { id: requestId },
        data: { status: action, adminNotes: adminNotes || null }
      });
      userId = req.userId;
    }

    if (action === "APPROVED" && userId) {
      if (!userModel) {
         const now = new Date().toISOString();
         await p.$executeRawUnsafe(
           `UPDATE User SET plan = 'ELITE', planStartDate = ?, planExpiresAt = NULL WHERE id = ?`,
           now, userId
         );
      } else {
         await userModel.update({
           where: { id: userId },
           data: { plan: "ELITE", planStartDate: new Date(), planExpiresAt: null }
         });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Update elite request error:', error);
    return { success: false, error: 'Xəta baş verdi.' };
  }
}

export async function requestSellerStatus(email: string) {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;
    
    // Check if already seller or already pending
    const user = await userModel.findUnique({ where: { email } });
    if (!user) return { success: false, error: "İstifadəçi tapılmadı." };
    if (user.role === "seller") return { success: false, error: "Siz artıq satıcısınız." };
    if (user.sellerRequestStatus === "PENDING") return { success: false, error: "Müraciətiniz gözləmədədir." };

    try {
      await userModel.update({
        where: { email },
        data: { sellerRequestStatus: "PENDING" }
      });
    } catch (e: any) {
      if (e.message?.includes("Unknown argument")) {
        await p.$executeRawUnsafe(`UPDATE User SET sellerRequestStatus = 'PENDING' WHERE email = ?`, email);
      } else throw e;
    }

    return { success: true };
  } catch (error) {
    console.error("Seller request error:", error);
    return { success: false, error: "Xəta baş verdi." };
  }
}

export async function updateSellerRequest(userId: string, action: "APPROVED" | "REJECTED") {
  try {
    const p = prisma as any;
    const userModel = p.user || p.User || p.users;

    let data: any = { sellerRequestStatus: action };
    if (action === "APPROVED") {
      data.role = "seller";
    }

    try {
      await userModel.update({
        where: { id: userId },
        data
      });
    } catch (e: any) {
       if (e.message?.includes("Unknown argument")) {
          if (action === "APPROVED") {
            await p.$executeRawUnsafe(`UPDATE User SET sellerRequestStatus = ?, role = 'seller' WHERE id = ?`, action, userId);
          } else {
            await p.$executeRawUnsafe(`UPDATE User SET sellerRequestStatus = ? WHERE id = ?`, action, userId);
          }
       } else throw e;
    }

    return { success: true };
  } catch (error) {
    console.error("Update request error:", error);
    return { success: false, error: "Xəta baş verdi." };
  }
}

export async function submitJobApplication(data: any) {
  try {
    const p = prisma as any;
    const reqModel = p.jobApplication || p.JobApplication;

    if (!reqModel) {
      const { randomUUID } = require('crypto');
      const id = randomUUID();
      const now = new Date().toISOString();
      await p.$executeRawUnsafe(
        `INSERT INTO JobApplication (id, roleTitle, fullName, email, phone, portfolio, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)`,
        id, data.roleTitle, data.fullName, data.email, data.phone, data.portfolio || null, data.message || "", now, now
      );
      return { success: true, application: { id } };
    }

    const application = await reqModel.create({
      data: {
        roleTitle: data.roleTitle,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        portfolio: data.portfolio || null,
        message: data.message || ""
      }
    });

    return { success: true, application };
  } catch (error) {
    console.error('Submit job application error:', error);
    return { success: false, error: 'Müraciətiniz göndərilərkən xəta baş verdi.' };
  }
}

export async function getJobApplications() {
  try {
    const p = prisma as any;
    const reqModel = p.jobApplication || p.JobApplication;
    
    if (!reqModel) {
      const rawReqs = await p.$queryRawUnsafe(`SELECT * FROM JobApplication ORDER BY createdAt DESC`);
      return { success: true, applications: rawReqs };
    }

    const applications = await reqModel.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, applications };
  } catch (error) {
    console.error('Get job applications error:', error);
    return { success: false, error: 'Müraciətlər yüklənərkən xəta baş verdi.' };
  }
}

export async function updateJobApplicationStatus(id: string, action: "ACCEPTED" | "REJECTED") {
  try {
    const p = prisma as any;
    const reqModel = p.jobApplication || p.JobApplication;
    const userModel = p.user || p.User || p.users;

    let appEmail = null;
    let appRole = null;

    if (!reqModel) {
       await p.$executeRawUnsafe(`UPDATE JobApplication SET status = ? WHERE id = ?`, action, id);
       const rows: any[] = await p.$queryRawUnsafe(`SELECT email, roleTitle FROM JobApplication WHERE id = ?`, id);
       if (rows && rows.length > 0) {
           appEmail = rows[0].email;
           appRole = rows[0].roleTitle;
       }
    } else {
       const req = await reqModel.update({
         where: { id },
         data: { status: action }
       });
       appEmail = req.email;
       appRole = req.roleTitle;
    }

    if (action === "ACCEPTED" && appEmail && appRole) {
       if (!userModel) {
           await p.$executeRawUnsafe(`UPDATE User SET jobTitle = ? WHERE email = ?`, appRole, appEmail);
       } else {
           try {
               await userModel.updateMany({
                   where: { email: appEmail },
                   data: { jobTitle: appRole }
               });
           } catch (e: any) {
               if (e.message?.includes("Unknown argument") || e.message?.includes("Unknown field")) {
                   await p.$executeRawUnsafe(`UPDATE User SET jobTitle = ? WHERE email = ?`, appRole, appEmail);
               } else throw e;
           }
       }
    } else if (action === "REJECTED" && appEmail) {
       if (!userModel) {
           await p.$executeRawUnsafe(`UPDATE User SET jobTitle = NULL WHERE email = ?`, appEmail);
       } else {
           try {
               await userModel.updateMany({
                   where: { email: appEmail },
                   data: { jobTitle: null }
               });
           } catch (e: any) {
               if (e.message?.includes("Unknown argument") || e.message?.includes("Unknown field")) {
                   await p.$executeRawUnsafe(`UPDATE User SET jobTitle = NULL WHERE email = ?`, appEmail);
               } else throw e;
           }
       }
    }

    return { success: true };
  } catch (error) {
    console.error('Update job application status error:', error);
    return { success: false, error: 'Xəta baş verdi.' };
  }
}

export async function getOrdersByUserEmail(email: string) {
  try {
    const orders = await (prisma as any).order.findMany({
      where: {
        user: { email }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return { success: false, orders: [] };
  }
}

