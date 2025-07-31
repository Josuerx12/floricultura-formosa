import { DayRule } from "@/lib/vo/day-rules.vo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function main() {
  console.log("Creating default delivery configurations...");

  let config = await prisma.configurations.findFirst();

  if (!config) {
    config = await prisma.configurations.create({ data: {} });
  }

  if (config) {
    const deliveryConfigs = await prisma.delivery_configurations.findFirst();

    if (!deliveryConfigs) {
      await prisma.delivery_configurations.create({
        data: {
          configuration: {
            connect: {
              id: config.id,
            },
          },
          day_rules: [
            {
              toJSON: () =>
                new DayRule({
                  day: 0,
                  start: "08:00",
                  end: "12:00",
                  blocked: true,
                }),
            },
            {
              toJSON: () =>
                new DayRule({
                  day: 1,
                  start: "08:00",
                  end: "12:00",
                }),
            },
            {
              toJSON: () =>
                new DayRule({
                  day: 2,
                  start: "08:00",
                  end: "12:00",
                }),
            },
            {
              toJSON: () =>
                new DayRule({
                  day: 3,
                  start: "08:00",
                  end: "16:30",
                }),
            },
            {
              toJSON: () =>
                new DayRule({
                  day: 4,
                  start: "08:00",
                  end: "16:30",
                }),
            },
            {
              toJSON: () =>
                new DayRule({
                  day: 5,
                  start: "08:00",
                  end: "16:30",
                }),
            },
            {
              toJSON: () =>
                new DayRule({
                  day: 6,
                  start: "08:00",
                  end: "10:00",
                }),
            },
          ],
          exceptions_allow: [],
          exceptions_block: [],
        },
      });
    }
  }

  console.log("Default delivery configurations created successfully.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
