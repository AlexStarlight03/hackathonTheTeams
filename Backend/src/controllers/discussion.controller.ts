import prisma from '../prisma/prisma';
import type { Request, Response } from "express";



export async function getAllDiscussion(req: Request, res: Response) {}
export async function getDiscussionByUserId(req: Request, res: Response) {}
export async function getDiscussionByGroupId(req: Request, res: Response) {}
export async function postNewPrivateDiscussion(req: Request, res: Response) {}
export async function postNewGroupDiscussion(req: Request, res: Response) {}
export async function updateDiscussion(req: Request, res: Response) {}
export async function deleteDiscussion(req: Request, res: Response) {}